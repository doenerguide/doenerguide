import { Flags, IFlags, getPrettyPrint } from './flags';

export interface Shop {
  id: string;
  imageUrl: string;
  name: string;
  address: string;
  rating: number;
  priceCategory: number;
  openingHours: [
    {
      open: string;
      close: string;
    }
  ]
  tel: string;
  flags: Flags;
  lat: number;
  lng: number;
}

export class ShopFunctions {
  static enabledFlags(flags: Flags) {
    let iFlags = flags as unknown as IFlags;
    let enabledFlags: string[] = [];
    for (let flag in flags) {
      if (iFlags[flag]) {
        enabledFlags.push(getPrettyPrint(flag));
      }
    }
    return enabledFlags;
  }

  static disabledFlags(flags: Flags) {
    let iFlags = flags as unknown as IFlags;
    let disabledFlags: string[] = [];
    for (let flag in flags) {
      if (!iFlags[flag]) {
        disabledFlags.push(getPrettyPrint(flag));
      }
    }
    return disabledFlags;
  }

  static checkOpeningColor(shop: Shop) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let nowTime = hours + ':' + minutes;
    let status = 'danger';
    for (let i = 0; i < shop.openingHours.length; i++) {
      const openingHour = shop.openingHours[i];
      if (
      nowTime > openingHour.open &&
      nowTime < openingHour.close
      ) {
      nowTime = hours + 1 + ':' + minutes;
      if (nowTime >= openingHour.close) {
        status = 'warning';
      } else {
        status = 'open';
      }
      break;
      }
    }
    return status;
  }
}
