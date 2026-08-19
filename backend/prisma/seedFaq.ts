import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FAQ_ITEMS = [
  {
    category: 'Tickets & Voyages',
    question: 'Comment réserver un ticket de bus avec Nagode Transfert ?',
    answer:
      "Vous pouvez réserver votre place directement en agence, ou en appelant notre centre de réservation. Consultez la page Tarifs pour connaître le prix de votre trajet, puis contactez l'agence de départ pour confirmer votre réservation.",
  },
  {
    category: 'Tickets & Voyages',
    question: 'Puis-je annuler ou reporter mon billet ?',
    answer:
      "Oui. Pour toute annulation ou report, contactez l'agence de départ au moins une heure avant l'heure de départ prévue. Passé ce délai, des frais peuvent s'appliquer.",
  },
  {
    category: 'Tickets & Voyages',
    question: 'Combien de bagages puis-je emporter ?',
    answer:
      "Chaque passager a droit à deux bagages inclus dans le prix du billet. Tout bagage supplémentaire entraîne des frais additionnels, à régler en agence avant l'embarquement.",
  },
  {
    category: 'Tickets & Voyages',
    question: "À quelle heure dois-je arriver avant le départ ?",
    answer:
      "Nous recommandons de vous présenter à l'agence 30 minutes avant l'heure de départ prévue pour l'embarquement et les formalités.",
  },
  {
    category: 'Colis',
    question: 'Comment envoyer un colis avec Nagode Transfert ?',
    answer:
      "Rendez-vous dans l'agence Nagode la plus proche avec votre colis. Nos agents évaluent le poids, le volume et la valeur déclarée pour fixer le tarif, puis votre colis est enregistré et pris en charge sur le prochain départ disponible.",
  },
  {
    category: 'Colis',
    question: "Comment est calculé le prix d'un colis ?",
    answer:
      "Le tarif dépend de la distance, du poids et du volume du colis. Consultez la page Tarifs pour une estimation par tranche, le prix définitif étant confirmé en agence après inspection.",
  },
  {
    category: 'Colis',
    question: 'Comment suivre mon colis ?',
    answer:
      "Appelez le numéro de suivi colis de l'agence de destination (disponible sur la page Nos Agences) en précisant les informations de votre envoi pour connaître son statut.",
  },
  {
    category: 'Colis',
    question: 'Mon colis peut-il être inspecté avant expédition ?',
    answer:
      "Oui, pour des raisons de sécurité, Nagode Transfert se réserve le droit d'inspecter tout colis avant son acceptation à l'expédition.",
  },
  {
    category: "Transfert d'argent",
    question: "Comment fonctionne le transfert d'argent Nagode Transfert ?",
    answer:
      "Rendez-vous en agence avec une pièce d'identité valide pour envoyer ou retirer de l'argent. Le bénéficiaire pourra retirer les fonds dans n'importe quelle agence du réseau muni de son identifiant de transaction et d'une pièce d'identité.",
  },
  {
    category: "Transfert d'argent",
    question: 'Quels documents sont nécessaires pour un transfert ?',
    answer:
      "Une pièce d'identité en cours de validité (CNI, passeport ou carte consulaire) est requise pour tout envoi ou retrait d'argent.",
  },
  {
    category: 'Général',
    question: 'Quelles villes et pays desservez-vous ?',
    answer:
      "Nagode Transfert dessert de nombreuses villes au Togo ainsi que des liaisons vers le Ghana et la Côte d'Ivoire. Consultez la page Nos Agences pour la liste complète des points de vente.",
  },
  {
    category: 'Général',
    question: 'Proposez-vous la location de bus pour les événements ?',
    answer:
      "Oui, nous louons des bus VIP et prestige pour vos mariages, fêtes traditionnelles, cérémonies régionales et déplacements de groupe. Demandez un devis via notre formulaire de contact.",
  },
  {
    category: 'Général',
    question: 'Que faire si mon bus a du retard ?',
    answer:
      "Contactez directement l'agence de départ pour connaître le nouvel horaire estimé. Nous faisons tout notre possible pour limiter les retards liés aux conditions de route.",
  },
  {
    category: 'Général',
    question: 'Comment vous contacter en cas de réclamation ?',
    answer:
      "Utilisez notre formulaire Suggestions / Réclamations ou contactez-nous directement par téléphone, WhatsApp ou e-mail depuis la page Contact. Nous traitons chaque demande avec attention.",
  },
];

async function main() {
  const existing = await prisma.faqItem.count();
  if (existing > 0) {
    console.log(`${existing} question(s) FAQ déjà présentes — aucune insertion.`);
    return;
  }
  for (let i = 0; i < FAQ_ITEMS.length; i++) {
    await prisma.faqItem.create({ data: { ...FAQ_ITEMS[i], order: i } });
  }
  console.log(`${FAQ_ITEMS.length} questions FAQ insérées.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
