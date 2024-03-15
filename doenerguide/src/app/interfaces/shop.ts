import { Flags } from './flags';

export interface Shop {
  imageUrl: string;
  name: string;
  address: string;
  rating: number;
  priceCategory: number;
  openingHours: {
    opens: string;
    closes: string;
  };
  flags: Flags;
}
