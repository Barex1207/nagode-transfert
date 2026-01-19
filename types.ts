
export enum ServiceTab {
  TRANSPORT = 'TICKET',
  COLIS = 'ENVOI COLIS',
  ARGENT = 'TRANSFERT D\'ARGENT'
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  flag: string;
}

export interface Feature {
  title: string;
  icon: string;
  active?: boolean;
}
