export interface Flags {
  acceptCreditCard: boolean;
  acceptDebitCard: boolean;
  stampCard: boolean;
}

export interface IFlags {
  [key: string]: boolean;
}

export function getPrettyPrint(flag: string) {
  switch (flag) {
    case 'acceptCreditCard':
      return 'Kreditkarte';
    case 'acceptDebitCard':
      return 'Debitkarte';
    case 'stampCard':
      return 'Stempelkarte';
    default:
      return flag;
  }
}
