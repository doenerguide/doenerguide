/**
 * Flags of a shop to show what it offers
 */
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

/**
 * Interface to store the flags key, value pairs
 */
export interface IFlags {
  [key: string]: boolean;
}

/**
 * List of all flags with key and value and pretty print value
 */
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

/**
 * Get the pretty print string of a flag
 * @param flag Flag to get the pretty print string of
 * @returns Pretty print string of the flag
 */
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
