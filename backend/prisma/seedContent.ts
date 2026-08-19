import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AgencySeed {
  city: string;
  country: string;
  countryCode: string;
  ticketPhones: string[];
  parcelPhones: string[];
  email: string;
}

// Fusion des données originales de Agencies.tsx (email, tickets/colis) et BookingForm.tsx
// (numéros supplémentaires par ville) — aucune donnée n'est perdue.
const agencies: AgencySeed[] = [
  { city: 'Sokodé', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 64'], parcelPhones: ['90 34 88 66', '91 26 59 76', '93 77 28 76'], email: 'sokode@nagodetransfert.com' },
  { city: 'Adjengré', country: 'Togo', countryCode: '+228', ticketPhones: ['93 25 66 79'], parcelPhones: ['93 25 66 79'], email: 'adjengre@nagodetransfert.com' },
  { city: 'Sotouboua', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 63'], parcelPhones: ['71 11 91 63'], email: 'sotouboua@nagodetransfert.com' },
  { city: 'Anié', country: 'Togo', countryCode: '+228', ticketPhones: ['93 17 27 93'], parcelPhones: ['93 17 27 93'], email: 'anie@nagodetransfert.com' },
  { city: 'Atakpamé', country: 'Togo', countryCode: '+228', ticketPhones: ['93 52 67 97', '71 11 91 62'], parcelPhones: ['93 52 67 97', '71 11 91 62'], email: 'atakpame@nagodetransfert.com' },
  { city: 'Adéticopé', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 61'], parcelPhones: ['71 64 76 38'], email: 'adeticope@nagodetransfert.com' },
  { city: 'Agoé Zongo', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 41'], parcelPhones: ['71 11 91 59'], email: 'agoe@nagodetransfert.com' },
  { city: 'Agbalépédo', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 40'], parcelPhones: ['93 52 67 98'], email: 'agbalepedo@nagodetransfert.com' },
  { city: 'Lycée', country: 'Togo', countryCode: '+228', ticketPhones: ['91 29 24 19'], parcelPhones: ['91 29 24 19'], email: 'lycee@nagodetransfert.com' },
  { city: 'Adidogomé', country: 'Togo', countryCode: '+228', ticketPhones: ['93 02 31 59'], parcelPhones: ['93 02 31 59'], email: 'adidogome@nagodetransfert.com' },
  { city: 'Kpalimé', country: 'Togo', countryCode: '+228', ticketPhones: ['93 17 27 94'], parcelPhones: ['93 17 27 94'], email: 'kpalime@nagodetransfert.com' },
  { city: 'Badou', country: 'Togo', countryCode: '+228', ticketPhones: ['93 25 66 62'], parcelPhones: ['93 25 66 62'], email: 'badou@nagodetransfert.com' },
  { city: 'Tchamba', country: 'Togo', countryCode: '+228', ticketPhones: ['93 17 27 98'], parcelPhones: ['93 17 27 98'], email: 'tchamba@nagodetransfert.com' },
  { city: 'Bafilo', country: 'Togo', countryCode: '+228', ticketPhones: ['71 64 76 37'], parcelPhones: ['71 64 76 37'], email: 'bafilo@nagodetransfert.com' },
  { city: 'Kara', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 54'], parcelPhones: ['71 64 76 39', '71 11 91 65'], email: 'kara@nagodetransfert.com' },
  { city: 'Kétao', country: 'Togo', countryCode: '+228', ticketPhones: ['90 11 62 58'], parcelPhones: ['90 11 62 58'], email: 'ketao@nagodetransfert.com' },
  { city: 'Lassa', country: 'Togo', countryCode: '+228', ticketPhones: ['71 64 76 35'], parcelPhones: ['71 64 76 35'], email: 'lassa@nagodetransfert.com' },
  { city: 'Agloudé', country: 'Togo', countryCode: '+228', ticketPhones: ['93 17 27 99'], parcelPhones: ['93 17 27 99'], email: 'agloud@nagodetransfert.com' },
  { city: 'Niamtougou', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 66'], parcelPhones: ['71 11 91 66'], email: 'niamtougou@nagodetransfert.com' },
  { city: 'Kanté', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 67'], parcelPhones: ['71 11 91 67'], email: 'kante@nagodetransfert.com' },
  { city: 'Mango', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 68'], parcelPhones: ['71 11 91 68'], email: 'mango@nagodetransfert.com' },
  { city: 'Dapaong Transport', country: 'Togo', countryCode: '+228', ticketPhones: ['71 11 91 69'], parcelPhones: ['71 11 91 69'], email: 'dapaong@nagodetransfert.com' },
  { city: 'Blitta', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 53'], parcelPhones: ['71 71 11 53'], email: 'blitta@nagodetransfert.com' },
  { city: 'Notsè', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 52'], parcelPhones: ['71 71 11 52'], email: 'notse@nagodetransfert.com' },
  { city: 'Bassar', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 40'], parcelPhones: ['71 71 11 40'], email: 'bassar@nagodetransfert.com' },
  { city: 'Kabou', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 41'], parcelPhones: ['71 71 11 41'], email: 'kabou@nagodetransfert.com' },
  { city: 'Kouka', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 42'], parcelPhones: ['71 71 11 42'], email: 'kouka@nagodetransfert.com' },
  { city: 'Atikoumé', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 51'], parcelPhones: ['71 71 11 51'], email: 'atikoume@nagodetransfert.com' },
  { city: 'Aflao', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 50'], parcelPhones: ['71 71 11 50'], email: 'aflao@nagodetransfert.com' },
  { city: 'Kaboli', country: 'Togo', countryCode: '+228', ticketPhones: ['71 71 11 54'], parcelPhones: ['71 71 11 54'], email: 'kaboli@nagodetransfert.com' },
  { city: 'Atchimota/Adenta', country: 'Ghana', countryCode: '+233', ticketPhones: ['53 051 6230'], parcelPhones: ['53 051 6230'], email: 'ghana@nagodetransfert.com' },
  { city: 'Commune de Koumassi', country: "Côte d'Ivoire", countryCode: '+225', ticketPhones: ['70 404 1286'], parcelPhones: ['70 404 1286'], email: 'ci@nagodetransfert.com' },
];

const destinations = [
  { name: 'Togo', siteLabel: 'Cathédrale du Sacré Coeur', countryCode: 'tg', imageUrl: 'https://i.pinimg.com/736x/b3/9d/84/b39d845f5f7a27dbcb1fe40f42c48a99.jpg', order: 0 },
  { name: 'Bénin', siteLabel: 'Village Lacustre Ganvié', countryCode: 'bj', imageUrl: 'https://i.pinimg.com/736x/a1/d1/ec/a1d1ec902266002f59a2ed439ae77fce.jpg', order: 1 },
  { name: 'Ghana', siteLabel: 'Freedom and justice', countryCode: 'gh', imageUrl: 'https://i.pinimg.com/736x/cd/ac/6d/cdac6dbb1cd3f02a50254d71e0b3a8f6.jpg', order: 2 },
  { name: 'Burkina Faso', siteLabel: 'Pics de Sindou', countryCode: 'bf', imageUrl: 'https://i.pinimg.com/736x/f3/b5/4e/f3b54e5fc84d664a838659516d3874cd.jpg', order: 3 },
  { name: "Côte d'Ivoire", siteLabel: 'Pont Alassane OUTARA', countryCode: 'ci', imageUrl: 'https://i.pinimg.com/736x/8c/19/3f/8c193f68026841360533f4cdee60ae9c.jpg', order: 4 },
];

const busFares: Array<[string, string, number]> = [
  ['Lomé', 'Notsè', 4000],
  ['Atakpamé', 'Lomé', 4000],
  ['Anié', 'Lomé', 4000],
  ['Blitta', 'Lomé', 5500],
  ['Lomé', 'Sotouboua', 5500],
  ['Adjengré', 'Lomé', 5500],
  ['Lomé', 'Sokodé', 5500],
  ['Kara', 'Lomé', 7000],
  ['Kétao', 'Lomé', 7500],
  ['Kantè', 'Lomé', 8000],
  ['Lomé', 'Niamtougou', 8000],
  ['Lomé', 'Mango', 9000],
  ['Dapaong', 'Lomé', 10000],
  ['Bassar', 'Lomé', 6000],
  ['Kabou', 'Lomé', 7000],
  ['Kouka', 'Lomé', 7000],
  ['Lomé', 'Tchamba', 6000],
  ['Kaboli', 'Lomé', 7500],
  ['Dapaong', 'Mango', 2000],
  ['Dapaong', 'Kantè', 3500],
  ['Dapaong', 'Niamtougou', 4000],
  ['Dapaong', 'Kara', 5000],
  ['Dapaong', 'Sokodé', 6000],
  ['Dapaong', 'Sotouboua', 7500],
  ['Blitta', 'Dapaong', 8000],
  ['Atakpamé', 'Dapaong', 8500],
  ['Kpalimé', 'Lomé', 2500],
  ['Atakpamé', 'Sokodé', 4000],
  ['Atakpamé', 'Kara', 5500],
  ['Atakpamé', 'Niamtougou', 7000],
  ['Atakpamé', 'Mango', 8500],
];

const colisFares = [
  { label: 'Trajets courts', origin: 'Avant Sokodé', price: 1000, description: 'Prix minimum garanti pour les petits colis (enveloppes).' },
  { label: 'Longs Trajets', origin: 'Sokodé et au-delà', price: 1500, description: 'Prix minimum appliqué dès que le trajet excède Sokodé.' },
  { label: 'International Accra', origin: 'Lomé ↔ Accra', price: 3000, description: 'Tarif de base pour enveloppes et courriers vers le Ghana.' },
  { label: 'International Abidjan', origin: 'Lomé ↔ Abidjan', price: 5000, description: "Tarif de base pour enveloppes et courriers vers la Côte d'Ivoire." },
];

interface ScheduleSeed {
  origin: string;
  destination: string;
  times: string[];
  frequency: string;
  agencyCity?: string;
}

const schedules: ScheduleSeed[] = [
  { origin: 'Lomé', destination: 'Sokodé', times: ['06:00', '07:30', '12:00', '18:00'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Kara', times: ['06:00', '07:30', '18:00'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Dapaong', times: ['06:00', '07:30', '18:00'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Bassar', times: ['06:30', '12:30'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Kpalimé', times: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Atakpamé', times: ['06:30', '08:30', '12:30', '16:30'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Accra (Ghana)', times: ['06:00', '08:00'], frequency: 'Quotidien' },
  { origin: 'Lomé', destination: 'Abidjan (CI)', times: ['06:00'], frequency: 'Lundi, Mercredi, Vendredi' },
  { origin: 'Sokodé', destination: 'Lomé', times: ['06:00', '07:30', '12:00', '18:00'], frequency: 'Quotidien', agencyCity: 'Sokodé' },
  { origin: 'Kara', destination: 'Lomé', times: ['06:00', '07:30', '18:00'], frequency: 'Quotidien', agencyCity: 'Kara' },
  { origin: 'Dapaong', destination: 'Lomé', times: ['05:30', '07:00', '17:30'], frequency: 'Quotidien', agencyCity: 'Dapaong Transport' },
  { origin: 'Atakpamé', destination: 'Lomé', times: ['06:00', '10:00', '14:00'], frequency: 'Quotidien', agencyCity: 'Atakpamé' },
  { origin: 'Kpalimé', destination: 'Lomé', times: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'], frequency: 'Quotidien', agencyCity: 'Kpalimé' },
];

const supportTicketParcelNumbers = ['93 76 25 60', '93 25 66 23', '93 25 66 24', '93 25 66 80', '93 17 27 92', '90 77 20 13'];
const supportMoneyNumber = '90 77 20 13';

const services = [
  { title: 'Réservation de tickets', description: 'Réservez votre place en quelques clics pour tous nos trajets.', icon: 'Bus', order: 0 },
  { title: 'Envoi de colis', description: 'Expédiez vos colis en toute sécurité vers toutes nos agences.', icon: 'Package', order: 1 },
  { title: "Transfert d'argent", description: 'Envoyez de l’argent à vos proches rapidement et en toute confiance.', icon: 'Send', order: 2 },
];

async function main() {
  console.log('Nettoyage des tables de contenu...');
  await prisma.schedule.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.fare.deleteMany();
  await prisma.supportNumber.deleteMany();
  await prisma.service.deleteMany();

  console.log(`Import de ${agencies.length} agences...`);
  const cityToAgencyId = new Map<string, string>();
  for (let i = 0; i < agencies.length; i++) {
    const a = agencies[i];
    const created = await prisma.agency.create({
      data: {
        city: a.city,
        country: a.country,
        countryCode: a.countryCode,
        ticketPhones: a.ticketPhones,
        parcelPhones: a.parcelPhones,
        email: a.email,
        order: i,
      },
    });
    cityToAgencyId.set(a.city, created.id);
  }

  console.log(`Import de ${destinations.length} destinations...`);
  for (const d of destinations) {
    await prisma.destination.create({ data: d });
  }

  console.log(`Import de ${busFares.length} tarifs bus...`);
  for (let i = 0; i < busFares.length; i++) {
    const [origin, destination, price] = busFares[i];
    await prisma.fare.create({ data: { type: 'BUS', origin, destination, price, order: i } });
  }

  console.log(`Import de ${colisFares.length} tarifs colis...`);
  for (let i = 0; i < colisFares.length; i++) {
    const f = colisFares[i];
    await prisma.fare.create({
      data: { type: 'COLIS', origin: f.origin, label: f.label, price: f.price, description: f.description, order: i },
    });
  }

  console.log(`Import de ${schedules.length} horaires...`);
  for (let i = 0; i < schedules.length; i++) {
    const s = schedules[i];
    const agencyId = s.agencyCity ? cityToAgencyId.get(s.agencyCity) ?? null : null;
    await prisma.schedule.create({
      data: {
        origin: s.origin,
        destination: s.destination,
        times: s.times,
        frequency: s.frequency,
        agencyId,
        order: i,
      },
    });
  }

  console.log("Import des numéros d'assistance...");
  for (let i = 0; i < supportTicketParcelNumbers.length; i++) {
    await prisma.supportNumber.create({ data: { category: 'TICKET', phone: supportTicketParcelNumbers[i], order: i } });
  }
  for (let i = 0; i < supportTicketParcelNumbers.length; i++) {
    await prisma.supportNumber.create({ data: { category: 'PARCEL', phone: supportTicketParcelNumbers[i], order: i } });
  }
  await prisma.supportNumber.create({ data: { category: 'MONEY', phone: supportMoneyNumber, order: 0 } });

  console.log(`Import de ${services.length} services...`);
  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  console.log('Réimport terminé avec succès.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
