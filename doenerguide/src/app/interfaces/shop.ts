import { Flags, IFlags, getPrettyPrint } from './flags';

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

export class ShopFunctions {
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
