export interface Flags {
  acceptCreditCard: boolean;
  acceptDebitCard: boolean;
  stampCard: boolean;
  open: boolean;
  halal: boolean;
  vegetarian: boolean;
  vegan: boolean;
  barrierFree: boolean;
  delivery: boolean;
  pickup: boolean;
}

export interface IFlags {
  [key: string]: boolean;
}

export const flagList = [
  {
    key: 'acceptCreditCard',
    value: 'Kreditkarte',
  },
  {
    key: 'acceptDebitCard',
    value: 'Debitkarte',
  },
  {
    key: 'stampCard',
    value: 'Stempelkarte',
  },
  {
    key: 'open',
    value: 'Geöffnet',
  },
  {
    key: 'halal',
    value: 'Halal',
  },
  {
    key: 'vegetarian',
    value: 'Vegetarisch',
  },
  {
    key: 'vegan',
    value: 'Vegan',
  },
  {
    key: 'barrierFree',
    value: 'Barrierefrei',
  },
  {
    key: 'delivery',
    value: 'Lieferung',
  },
  {
    key: 'pickup',
    value: 'Abholung',
  },
];

export function getPrettyPrint(flag: string) {
  switch (flag) {
    case 'acceptCreditCard':
      return 'Kreditkarte';
    case 'acceptDebitCard':
      return 'Debitkarte';
    case 'stampCard':
      return 'Stempelkarte';
    case 'open':
      return 'Geöffnet';
    case 'halal':
      return 'Halal';
    case 'vegetarian':
      return 'Vegetarisch';
    case 'vegan':
      return 'Vegan';
    case 'barrierFree':
      return 'Barrierefrei';
    case 'delivery':
      return 'Lieferung';
    case 'pickup':
      return 'Abholung';
    default:
      return flag;
  }
}
