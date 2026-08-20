import { prisma } from './prisma.js';

// Free, zero-cost fallback for the chat widget: keyword matching against the
// site's own FAQ/fares/schedules/agencies/support numbers. Used whenever no
// Anthropic API key is configured (or the API call fails), so the assistant
// always has something useful to say without depending on a paid service.

interface KnowledgeEntry {
  keywords: Set<string>;
  answer: string;
}

const STOPWORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'a', 'au', 'aux', 'en', 'pour', 'avec', 'sans',
  'est', 'sont', 'ce', 'ces', 'cette', 'que', 'qui', 'quoi', 'quel', 'quelle', 'quels', 'quelles', 'comment',
  'combien', 'quand', 'ou', 'sur', 'dans', 'par', 'mon', 'ma', 'mes', 'votre', 'vos', 'je', 'tu', 'il', 'elle',
  'nous', 'vous', 'ils', 'elles', 'vers', 'bonjour', 'bonsoir', 'salut', 'svp', 'merci', 'jai', 'jaimerais',
  'voudrais', 'faire', 'peut', 'peux', 'dois', 'suis', 'etes', 'avez', 'avoir', 'etre',
]);

function normalize(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (combining marks left over after NFD)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function tokenSet(text: string): Set<string> {
  return new Set(normalize(text));
}

let cache: { entries: KnowledgeEntry[]; supportPhone?: string; expiresAt: number } | null = null;
const CACHE_MS = 60_000;

async function buildKnowledge(): Promise<{ entries: KnowledgeEntry[]; supportPhone?: string }> {
  const [faq, agencies, fares, supportNumbers, schedules] = await Promise.all([
    prisma.faqItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.agency.findMany({ orderBy: { order: 'asc' } }),
    prisma.fare.findMany({ orderBy: { order: 'asc' } }),
    prisma.supportNumber.findMany({ orderBy: { order: 'asc' } }),
    prisma.schedule.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const entries: KnowledgeEntry[] = [];

  for (const f of faq) {
    entries.push({ keywords: tokenSet(`${f.question} ${f.question}`), answer: f.answer });
  }

  for (const f of fares) {
    const kind = f.type === 'COLIS' ? 'colis' : 'ticket bus';
    entries.push({
      keywords: tokenSet(`tarif prix ${kind} ${f.origin} ${f.destination}`),
      answer: `Le tarif ${kind} ${f.origin} → ${f.destination} est de ${f.price.toLocaleString('fr-FR')} FCFA.`,
    });
  }

  for (const s of schedules) {
    entries.push({
      keywords: tokenSet(`horaire heure depart ${s.origin} ${s.destination}`),
      answer:
        s.times.length > 0
          ? `Horaires ${s.origin} → ${s.destination} : ${s.times.join(', ')} (${s.frequency}).`
          : `Trajet ${s.origin} → ${s.destination} : ${s.frequency}.`,
    });
  }

  for (const a of agencies) {
    const parts = [`Agence de ${a.city}, ${a.country}.`];
    if (a.address) parts.push(a.address + '.');
    if (a.ticketPhones.length) parts.push(`Tickets : ${a.ticketPhones.join(', ')}.`);
    if (a.parcelPhones.length) parts.push(`Colis : ${a.parcelPhones.join(', ')}.`);
    if (a.openingHours) parts.push(`Horaires d'ouverture : ${a.openingHours}.`);
    entries.push({
      keywords: tokenSet(`agence adresse contact ${a.city} ${a.country}`),
      answer: parts.join(' '),
    });
  }

  const categoryLabel: Record<string, string> = { TICKET: 'billets/tickets', PARCEL: 'colis', MONEY: "transfert d'argent" };
  for (const s of supportNumbers) {
    entries.push({
      keywords: tokenSet(`numero telephone assistance contact ${categoryLabel[s.category] ?? ''}`),
      answer: `Pour ${categoryLabel[s.category] ?? 'assistance'}, appelez le ${s.phone}.`,
    });
  }

  const ticketNumber = supportNumbers.find((s) => s.category === 'TICKET')?.phone;

  return { entries, supportPhone: ticketNumber };
}

async function getKnowledge() {
  if (cache && cache.expiresAt > Date.now()) return cache;
  const { entries, supportPhone } = await buildKnowledge();
  cache = { entries, supportPhone, expiresAt: Date.now() + CACHE_MS };
  return cache;
}

const GREETING_ONLY = new Set(['bonjour', 'salut', 'bonsoir', 'coucou', 'hello', 'bjr']);

export async function answerLocally(userMessage: string): Promise<string> {
  const { entries, supportPhone } = await getKnowledge();
  const userTokens = normalize(userMessage);

  if (userTokens.length === 0 || (userTokens.length <= 1 && GREETING_ONLY.has(userTokens[0]))) {
    return 'Bonjour ! Je peux vous renseigner sur nos tarifs, nos horaires, nos agences ou nos numéros d’assistance. Que souhaitez-vous savoir ?';
  }

  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of entries) {
    let score = 0;
    for (const t of userTokens) if (entry.keywords.has(t)) score++;
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }

  // A single shared word is only a confident match when the question itself
  // was that short (e.g. just "Kara" or "tarifs") — otherwise one coincidental
  // overlap in a longer, unrelated sentence must not pass as a real answer.
  const requiredScore = userTokens.length <= 1 ? 1 : 2;
  if (best && best.score >= requiredScore) {
    return best.entry.answer;
  }

  const contactLine = supportPhone
    ? ` Vous pouvez aussi appeler le ${supportPhone} ou passer par notre formulaire de contact.`
    : ' Vous pouvez passer par notre formulaire de contact pour être aidé directement.';

  return `Je n'ai pas trouvé de réponse précise à cette question dans mes informations actuelles.${contactLine}`;
}
