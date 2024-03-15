export interface Flags {
  acceptCard: boolean;
  stampCard: boolean;
}

export interface IFlags {
  [key: string]: boolean;
}

export function getPrettyPrint(flag: string) {
  switch (flag) {
    case 'acceptCard':
      return 'Kartenzahlung';
    case 'stampCard':
      return 'Stempelkarte';
    default:
      return flag;
  }
}
