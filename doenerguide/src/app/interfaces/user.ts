import { Shop } from './shop';

export interface User {
  id: number;
  email: string;
  vorname: string;
  nachname: string;
  favorites: Shop[];
}
