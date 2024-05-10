import { Flags, IFlags, getPrettyPrint } from './flags';

/**
 * Interface for the shop object
 */
export interface Shop {
  id: string;
  imageUrl: string;
  name: string;
  address: string;
  distance?: number;
  rating: number;
  priceCategory: number;
  openToday: {
    open: string;
    close: string;
  }[];
  openingHours: {
    [weekday: string]: {
      open: string;
      close: string;
    }[];
  };
  tel: string;
  flags: Flags;
  lat: number;
  lng: number;
}

/**
 * Class for the functions to manage the shop object
 */
export class ShopFunctions {
  /**
   * Returns the pretty print of the flags
   * @param flags Flags which should be pretty printed
   * @returns Array of pretty printed flags
   */
  static enabledFlags(flags?: Flags) {
    if (!flags) {
      return [];
    }
    let iFlags = flags as unknown as IFlags;
    let enabledFlags: string[] = [];
    for (let flag in flags) {
      if (iFlags[flag]) {
        enabledFlags.push(getPrettyPrint(flag));
      }
    }
    return enabledFlags;
  }

  /**
   * Returns the pretty print of the flags which are disabled
   * @param flags Flags which should be pretty printed
   * @returns Array of pretty printed flags
   */
  static disabledFlags(flags?: Flags) {
    if (!flags) {
      return [];
    }
    let iFlags = flags as unknown as IFlags;
    let disabledFlags: string[] = [];
    for (let flag in flags) {
      if (!iFlags[flag]) {
        disabledFlags.push(getPrettyPrint(flag));
      }
    }
    return disabledFlags;
  }

  /**
   * Check if a shop is open
   * @param openingHours Opening hours of the shop
   * @returns Object with the status if the shop is open and the color of the status
   */
  static checkOpeningColor(openingHours?: { open: string; close: string }[]): {
    status: string;
    open: boolean;
  } {
    if (!openingHours) {
      return { status: 'danger', open: false };
    }
    const now = new Date();
    let nowTime = now.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let status = 'danger';
    let open = false;
    for (let openingHour of openingHours) {
      if (openingHour.close > openingHour.open) {
        if (nowTime >= openingHour.open && nowTime <= openingHour.close) {
          nowTime = hours + 1 + ':' + minutes;
          if (nowTime >= openingHour.close) {
            status = 'warning';
          } else {
            status = 'open';
          }
          open = true;
          break;
        }
      } else if (nowTime >= '06:00' && nowTime < '23:59') {
        if (nowTime > openingHour.open) {
          status = 'open';
          open = true;
          break;
        }
      } else if (nowTime < openingHour.close) {
        nowTime = hours + 1 + ':' + minutes;
        if (nowTime >= openingHour.close) {
          status = 'warning';
        } else {
          status = 'open';
        }
        open = true;
      }
    }
    return { status: status, open: open };
  }
}
