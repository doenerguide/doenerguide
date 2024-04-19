import { Flags, IFlags, getPrettyPrint } from './flags';

export interface Shop {
  id: string;
  imageUrl: string;
  name: string;
  address: string;
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

  static checkOpeningColor(shop?: Shop) {
    if (!shop) {
      return 'danger';
    }
    const now = new Date();
    let nowTime = now.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let status = 'danger';
    for (let openingHour of shop.openToday) {
      if (openingHour.close < '00:00') {
        if (nowTime > openingHour.open && nowTime < openingHour.close) {
          nowTime = hours + 1 + ':' + minutes;
          if (nowTime >= openingHour.close) {
            status = 'warning';
          } else {
            status = 'open';
          }
          break;
        }
      } else {
        if (nowTime >= '10:00' && nowTime < '23:59') {
          if (nowTime > openingHour.open) {
            status = 'open';
            break;
          }
        } else {
          if (nowTime < openingHour.close) {
            nowTime = hours + 1 + ':' + minutes;
            if (nowTime >= openingHour.close) {
              status = 'warning';
            } else {
              status = 'open';
            }
          }
        }
      }
    }
    return status;
  }
}
