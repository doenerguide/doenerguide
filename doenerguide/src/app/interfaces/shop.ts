import { Flags, IFlags, getPrettyPrint } from './flags';

export interface Shop {
  id: string;
  imageUrl: string;
  name: string;
  address: string;
  rating: number;
  priceCategory: number;
  openingHours: {
    opens: string;
    closes: string;
  };
  mapsUrl: string;
  tel: string;
  flags: Flags;
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
    if (
      nowTime > shop.openingHours.opens &&
      nowTime < shop.openingHours.closes
    ) {
      nowTime = hours + 1 + ':' + minutes;
      if (nowTime >= shop.openingHours.closes) {
        return 'warning';
      }
      return 'open';
    } else {
      return 'danger';
    }
  }
}
