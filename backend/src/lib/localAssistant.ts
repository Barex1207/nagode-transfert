import { prisma } from './prisma.js';

// Free, zero-cost fallback for the chat widget: matches against the site's
// own FAQ/fares/schedules/agencies/support numbers/destinations. Used
// whenever no Anthropic API key is configured (or the paid call fails), so
// the assistant always has something useful to say without depending on a
// paid service.
//
// Route/fare/schedule questions are handled by exact place-name matching,
// never fuzzy keyword scoring — a question about a route we don't serve
// must say so, and must never be answered with the price of a different
// route just because a word or two overlapped.

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

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (combining marks left over after NFD)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function tokenSet(text: string): Set<string> {
  return new Set(tokens(text));
}

interface FareRow {
  type: 'BUS' | 'COLIS';
  origin: string;
  destination: string;
  price: number;
}
interface ScheduleRow {
  origin: string;
  destination: string;
  times: string[];
  frequency: string;
}
interface AgencyRow {
  city: string;
  country: string;
  address: string;
  ticketPhones: string[];
  parcelPhones: string[];
  openingHours: string;
}
interface DestinationRow {
  name: string;
  status: 'ACTIVE' | 'COMING_SOON';
}

interface Knowledge {
  faqEntries: KnowledgeEntry[];
  fares: FareRow[];
  schedules: ScheduleRow[];
  agencies: AgencyRow[];
  destinations: DestinationRow[];
  places: string[]; // normalized known place names (agency cities, fare/schedule origins+destinations), longest first
  supportPhone?: string;
}

let cache: (Knowledge & { expiresAt: number }) | null = null;
const CACHE_MS = 60_000;

async function buildKnowledge(): Promise<Knowledge> {
  const [faq, agencies, fares, supportNumbers, schedules, destinations] = await Promise.all([
    prisma.faqItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.agency.findMany({ orderBy: { order: 'asc' } }),
    prisma.fare.findMany({ orderBy: { order: 'asc' } }),
    prisma.supportNumber.findMany({ orderBy: { order: 'asc' } }),
    prisma.schedule.findMany({ orderBy: { order: 'asc' } }),
    prisma.destination.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const faqEntries: KnowledgeEntry[] = faq.map((f) => ({ keywords: tokenSet(f.question), answer: f.answer }));

  const placeSet = new Set<string>();
  for (const a of agencies) placeSet.add(normalize(a.city));
  for (const f of fares) {
    placeSet.add(normalize(f.origin));
    placeSet.add(normalize(f.destination));
  }
  for (const s of schedules) {
    placeSet.add(normalize(s.origin));
    placeSet.add(normalize(s.destination));
  }
  for (const d of destinations) placeSet.add(normalize(d.name));
  // Longest-first so "cote d ivoire" is tried before a shorter partial overlap.
  const places = [...placeSet].filter(Boolean).sort((a, b) => b.length - a.length);

  const categoryLabel: Record<string, string> = { TICKET: 'billets/tickets', PARCEL: 'colis', MONEY: "transfert d'argent" };
  for (const s of supportNumbers) {
    faqEntries.push({
      keywords: tokenSet(`numero telephone assistance contact ${categoryLabel[s.category] ?? ''}`),
      answer: `Pour ${categoryLabel[s.category] ?? 'assistance'}, appelez le ${s.phone}.`,
    });
  }

  const supportPhone = supportNumbers.find((s) => s.category === 'TICKET')?.phone;

  return {
    faqEntries,
    fares: fares.map((f) => ({ type: f.type, origin: f.origin, destination: f.destination, price: f.price })),
    schedules: schedules.map((s) => ({ origin: s.origin, destination: s.destination, times: s.times, frequency: s.frequency })),
    agencies: agencies.map((a) => ({
      city: a.city,
      country: a.country,
      address: a.address,
      ticketPhones: a.ticketPhones,
      parcelPhones: a.parcelPhones,
      openingHours: a.openingHours,
    })),
    destinations: destinations.map((d) => ({ name: d.name, status: d.status })),
    places,
    supportPhone,
  };
}

async function getKnowledge(): Promise<Knowledge> {
  if (cache && cache.expiresAt > Date.now()) return cache;
  const knowledge = await buildKnowledge();
  cache = { ...knowledge, expiresAt: Date.now() + CACHE_MS };
  return cache;
}

/** Which known places (agencies/fares/schedules/destinations) are mentioned in this message, longest match first. */
function findMentionedPlaces(normalizedMessage: string, places: string[]): string[] {
  const found: string[] = [];
  let remaining = normalizedMessage;
  for (const place of places) {
    if (remaining.includes(place)) {
      found.push(place);
      remaining = remaining.replace(place, ' ');
    }
  }
  return found;
}

const ROUTE_INTENT_WORDS = ['tarif', 'prix', 'cout', 'coute', 'coutent', 'horaire', 'heure', 'depart', 'trajet', 'ligne', 'dessert', 'desservez', 'desservi'];
const CONTACT_INTENT_WORDS = ['agence', 'adresse', 'contact', 'numero', 'telephone', 'ou'];
const GREETING_ONLY = new Set(['bonjour', 'salut', 'bonsoir', 'coucou', 'hello', 'bjr']);

function notServedMessage(places: string[], knowledge: Knowledge): string {
  const names = places.map((p) => placeDisplayName(p, knowledge));
  const routeLabel = names.length >= 2 ? `${names[0]} → ${names[1]}` : names[0] ?? '';

  // Is one of the mentioned places a destination we explicitly marked "coming soon"?
  const comingSoon = knowledge.destinations.find(
    (d) => d.status === 'COMING_SOON' && places.some((p) => normalize(d.name) === p),
  );
  if (comingSoon) {
    return `La destination ${comingSoon.name} n'est pas encore desservie par Nagode Transfert — cette ligne est prévue mais pas encore ouverte. Elle sera annoncée sur le site dès sa mise en service.`;
  }

  const contact = knowledge.supportPhone
    ? ` Vous pouvez appeler le ${knowledge.supportPhone} pour vérifier.`
    : ' Vous pouvez nous contacter via le formulaire de contact pour vérifier.';
  return `Je n'ai pas de ligne ${routeLabel} dans nos données actuelles — nous ne desservons peut-être pas encore ce trajet.${contact}`;
}

function cap(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Recover the original, correctly-accented display name for a normalized place token. */
function placeDisplayName(normalizedPlace: string, knowledge: Knowledge): string {
  for (const a of knowledge.agencies) if (normalize(a.city) === normalizedPlace) return a.city;
  for (const f of knowledge.fares) {
    if (normalize(f.origin) === normalizedPlace) return f.origin;
    if (normalize(f.destination) === normalizedPlace) return f.destination;
  }
  for (const s of knowledge.schedules) {
    if (normalize(s.origin) === normalizedPlace) return s.origin;
    if (normalize(s.destination) === normalizedPlace) return s.destination;
  }
  for (const d of knowledge.destinations) if (normalize(d.name) === normalizedPlace) return d.name;
  return cap(normalizedPlace);
}

export async function answerLocally(userMessage: string): Promise<string> {
  const knowledge = await getKnowledge();
  const normalized = normalize(userMessage);
  const userTokens = tokens(userMessage);

  if (userTokens.length === 0 || (userTokens.length <= 1 && GREETING_ONLY.has(userTokens[0]))) {
    return 'Bonjour ! Je peux vous renseigner sur nos tarifs, nos horaires, nos agences ou nos numéros d’assistance. Que souhaitez-vous savoir ?';
  }

  const mentionedPlaces = findMentionedPlaces(normalized, knowledge.places);
  const hasRouteIntent = ROUTE_INTENT_WORDS.some((w) => normalized.includes(w));
  const hasContactIntent = CONTACT_INTENT_WORDS.some((w) => normalized.includes(w));
  // "Lomé - Cotonou", "Lomé vers Cotonou", "de Lomé à Cotonou"... signals the
  // user means a specific two-city route even if we only recognized one side
  // of it — in that case we must NOT fall back to listing every fare for the
  // one city we do recognize, since that isn't an answer to what was asked.
  // The hyphen check runs on the raw message: normalize() already turns "-"
  // into a plain space, so it would never be found in `normalized` itself.
  const hasRouteConnector = /\s-\s|\bvers\b|\bjusqu|\ba\s|\bau\s/.test(normalized) || /\s-\s/.test(userMessage);

  // --- Route / fare / schedule questions: exact match only, never a fallback route. ---
  if (mentionedPlaces.length >= 1 && (hasRouteIntent || mentionedPlaces.length >= 2)) {
    if (mentionedPlaces.length >= 2) {
      const [a, b] = mentionedPlaces;
      const fare = knowledge.fares.find(
        (f) => (normalize(f.origin) === a && normalize(f.destination) === b) || (normalize(f.origin) === b && normalize(f.destination) === a),
      );
      const schedule = knowledge.schedules.find(
        (s) => (normalize(s.origin) === a && normalize(s.destination) === b) || (normalize(s.origin) === b && normalize(s.destination) === a),
      );
      const wantsScheduleOnly = /horaire|heure|depart/.test(normalized) && !/tarif|prix|cout|coute/.test(normalized);
      const fareAnswer = fare ? `Le tarif ${fare.type === 'COLIS' ? 'colis' : 'ticket bus'} ${fare.origin} → ${fare.destination} est de ${fare.price.toLocaleString('fr-FR')} FCFA.` : null;
      const scheduleAnswer = schedule
        ? schedule.times.length > 0
          ? `Horaires ${schedule.origin} → ${schedule.destination} : ${schedule.times.join(', ')} (${schedule.frequency}).`
          : `Trajet ${schedule.origin} → ${schedule.destination} : ${schedule.frequency}.`
        : null;

      if (wantsScheduleOnly && scheduleAnswer) return scheduleAnswer;
      if (fareAnswer) return fareAnswer;
      if (scheduleAnswer) return scheduleAnswer;
      return notServedMessage(mentionedPlaces, knowledge);
    }

    // A route connector ("Lomé - Cotonou", "de Lomé à Cotonou"...) with only
    // one side recognized means the *other* side isn't in our network — that
    // is a "not served" answer, not a generic list for the city we do know.
    if (hasRouteConnector) {
      return notServedMessage(mentionedPlaces, knowledge);
    }

    // Otherwise, exactly one place mentioned with route intent: list what we
    // actually have for it (fares and/or schedules), prioritized by what was
    // actually asked so a pure "horaires" question doesn't open with prices.
    const place = mentionedPlaces[0];
    const matchingFares = knowledge.fares.filter((f) => normalize(f.origin) === place || normalize(f.destination) === place);
    const matchingSchedules = knowledge.schedules.filter((s) => normalize(s.origin) === place || normalize(s.destination) === place);
    const wantsScheduleOnly = /horaire|heure|depart/.test(normalized) && !/tarif|prix|cout|coute/.test(normalized);
    const wantsFareOnly = /tarif|prix|cout|coute/.test(normalized) && !/horaire|heure|depart/.test(normalized);

    const fareSection = matchingFares.length
      ? matchingFares
          .slice(0, 6)
          .map((f) => `${f.origin} → ${f.destination} : ${f.price.toLocaleString('fr-FR')} FCFA (${f.type === 'COLIS' ? 'colis' : 'bus'})`)
          .join('\n')
      : null;
    const scheduleSection = matchingSchedules.length
      ? matchingSchedules
          .slice(0, 6)
          .map((s) => `${s.origin} → ${s.destination} : ${s.times.join(', ') || s.frequency}`)
          .join('\n')
      : null;

    const sections: string[] = [];
    if (wantsScheduleOnly) {
      if (scheduleSection) sections.push(scheduleSection);
      else if (fareSection) sections.push(fareSection);
    } else if (wantsFareOnly) {
      if (fareSection) sections.push(fareSection);
      else if (scheduleSection) sections.push(scheduleSection);
    } else {
      if (fareSection) sections.push(fareSection);
      if (scheduleSection) sections.push(scheduleSection);
    }
    if (sections.length > 0) {
      return `Voici ce que j'ai pour ${placeDisplayName(place, knowledge)} :\n${sections.join('\n')}`;
    }
    return notServedMessage(mentionedPlaces, knowledge);
  }

  // --- Agency / contact questions: list every agency for the mentioned city (there can be more than one). ---
  if (mentionedPlaces.length >= 1 && hasContactIntent) {
    const place = mentionedPlaces[0];
    const matches = knowledge.agencies.filter((a) => normalize(a.city) === place);
    if (matches.length === 1) {
      const a = matches[0];
      const parts = [`Agence de ${a.city}, ${a.country}.`];
      if (a.address) parts.push(a.address + '.');
      if (a.ticketPhones.length) parts.push(`Tickets : ${a.ticketPhones.join(', ')}.`);
      if (a.parcelPhones.length) parts.push(`Colis : ${a.parcelPhones.join(', ')}.`);
      if (a.openingHours) parts.push(`Horaires : ${a.openingHours}.`);
      return parts.join(' ');
    }
    if (matches.length > 1) {
      const lines = matches.map((a, i) => {
        const phones = [...a.ticketPhones, ...a.parcelPhones].join(', ') || 'voir formulaire de contact';
        return `${i + 1}. ${a.address || a.city} — ${phones}`;
      });
      return `Nous avons plusieurs agences à ${matches[0].city}. Précisez laquelle vous convient :\n${lines.join('\n')}`;
    }
    return notServedMessage([place], knowledge);
  }

  // --- Everything else: fuzzy FAQ matching. ---
  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of knowledge.faqEntries) {
    let score = 0;
    for (const t of userTokens) if (entry.keywords.has(t)) score++;
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  const requiredScore = userTokens.length <= 1 ? 1 : 2;
  if (best && best.score >= requiredScore) {
    return best.entry.answer;
  }

  const contactLine = knowledge.supportPhone
    ? ` Vous pouvez aussi appeler le ${knowledge.supportPhone} ou passer par notre formulaire de contact.`
    : ' Vous pouvez passer par notre formulaire de contact pour être aidé directement.';
  return `Je n'ai pas trouvé de réponse précise à cette question dans mes informations actuelles.${contactLine}`;
}
