import Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../lib/env.js';
import { prisma } from '../lib/prisma.js';
import { answerLocally } from '../lib/localAssistant.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { chatSchema } from '../validators/schemas.js';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés, merci de patienter quelques minutes.' },
});

const anthropic = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;

const ASSISTANT_NAME = 'Nagode';
const MODEL = 'claude-haiku-4-5-20251001';

async function buildSystemPrompt(): Promise<string> {
  const [settings, faq, agencies, fares, supportNumbers, schedules] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'main' } }),
    prisma.faqItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.agency.findMany({ orderBy: { order: 'asc' } }),
    prisma.fare.findMany({ orderBy: { order: 'asc' } }),
    prisma.supportNumber.findMany({ orderBy: { order: 'asc' } }),
    prisma.schedule.findMany({ orderBy: { order: 'asc' }, include: { agency: true } }),
  ]);

  const siteName = settings?.siteName ?? 'Nagode Transfert';

  const faqBlock = faq.map((f) => `Q: ${f.question}\nR: ${f.answer}`).join('\n\n') || 'Aucune donnée.';

  const agenciesBlock =
    agencies
      .map((a) => {
        const parts = [`${a.city}, ${a.country}`];
        if (a.address) parts.push(`Adresse: ${a.address}`);
        if (a.ticketPhones.length) parts.push(`Tickets: ${a.ticketPhones.join(', ')}`);
        if (a.parcelPhones.length) parts.push(`Colis: ${a.parcelPhones.join(', ')}`);
        if (a.openingHours) parts.push(`Horaires: ${a.openingHours}`);
        return `- ${parts.join(' | ')}`;
      })
      .join('\n') || 'Aucune donnée.';

  const busFares = fares.filter((f) => f.type === 'BUS');
  const colisFares = fares.filter((f) => f.type === 'COLIS');
  const faresBlock = [
    busFares.length
      ? `Tickets bus:\n${busFares.map((f) => `- ${f.origin} → ${f.destination}: ${f.price} FCFA`).join('\n')}`
      : '',
    colisFares.length
      ? `Colis:\n${colisFares.map((f) => `- ${f.origin} → ${f.destination}: ${f.price} FCFA`).join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n') || 'Aucune donnée.';

  const schedulesBlock =
    schedules
      .map((s) => `- ${s.origin} → ${s.destination}: ${s.times.join(', ') || '—'} (${s.frequency})`)
      .join('\n') || 'Aucune donnée.';

  const supportBlock =
    supportNumbers.map((s) => `- ${s.category}: ${s.phone}`).join('\n') || 'Aucune donnée.';

  return `Tu es ${ASSISTANT_NAME}, l'assistant virtuel officiel du site de ${siteName}, une société de transport, colis et transfert d'argent en Afrique de l'Ouest.

RÈGLES STRICTES :
- Réponds toujours en français, de façon brève, chaleureuse et professionnelle (2-4 phrases maximum sauf si on te demande une liste).
- Utilise UNIQUEMENT les informations fournies ci-dessous (tarifs, horaires, agences, FAQ, numéros). N'invente JAMAIS un prix, un horaire ou une donnée qui n'est pas dans ce contexte.
- Si tu ne trouves pas l'information demandée, dis-le clairement et oriente vers le numéro d'assistance approprié ci-dessous, ou vers le formulaire de contact du site.
- Pour toute réservation, paiement, réclamation ou question sensible (numéro de billet, litige, remboursement), ne traite jamais la demande toi-même : oriente vers un numéro d'assistance ou le formulaire de contact.
- Ne demande et ne répète jamais de données bancaires ou de mot de passe.
- Reste toujours dans le périmètre de ${siteName} (transport de bus, colis, transfert d'argent). Décline poliment toute question hors sujet.

DONNÉES ACTUELLES DU SITE :

## FAQ
${faqBlock}

## Agences
${agenciesBlock}

## Tarifs
${faresBlock}

## Horaires
${schedulesBlock}

## Numéros d'assistance
${supportBlock}`;
}

router.post(
  '/',
  chatLimiter,
  validateBody(chatSchema),
  asyncHandler(async (req, res) => {
    const { messages } = req.body as { messages: { role: 'user' | 'assistant'; content: string }[] };
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

    if (!anthropic) {
      res.json({ reply: await answerLocally(lastUserMessage) });
      return;
    }

    try {
      const system = await buildSystemPrompt();
      const completion = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 500,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const reply = completion.content.find((block) => block.type === 'text')?.text ?? '';
      res.json({ reply });
    } catch (err) {
      // Claude API unavailable (billing, rate limit, network...) — degrade to
      // the free local matcher instead of failing the request outright.
      console.error('Anthropic API error, falling back to local assistant:', err);
      res.json({ reply: await answerLocally(lastUserMessage) });
    }
  }),
);

export default router;
