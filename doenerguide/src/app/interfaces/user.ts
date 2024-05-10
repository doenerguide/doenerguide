import { Shop } from './shop';

export interface User {
  id: number;
  mail: string;
  vorname: string;
  nachname: string;
  favoriten: Shop[];
  identification_code: string;
  doenerladen?: string;
}
