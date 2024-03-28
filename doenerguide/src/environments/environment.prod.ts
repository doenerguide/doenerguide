// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  shops: [
    {
      id: '1',
      imageUrl: 'assets/img/doener.jpg',
      name: 'Döner 123',
      address: 'Straße 1, 12345 Musterstadt',
      rating: 4.5,
      priceCategory: 2,
      flags: {
        acceptCard: true,
        stampCard: true,
      },
      openingHours: {
        opens: '10:00',
        closes: '22:00',
      },
      mapsUrl: 'https://maps.app.goo.gl/ADmwsBPCN2GncvLUA',
      tel: '0123456789',
    },
    {
      id: '2',
      imageUrl: 'assets/img/doener.jpg',
      name: 'Döner Jetzt',
      address: 'Straße 2, 12345 Musterstadt',
      rating: 2.5,
      priceCategory: 1,
      flags: {
        acceptCard: true,
        stampCard: false,
      },
      openingHours: {
        opens: '11:00',
        closes: '23:00',
      },
      mapsUrl: 'https://maps.app.goo.gl/ADmwsBPCN2GncvLUA',
      tel: '0123456789',
    },
    {
      id: '3',
      imageUrl: 'assets/img/doener.jpg',
      name: 'Döner Imbiss',
      address: 'Straße 3, 12345 Musterstadt',
      rating: 2,
      priceCategory: 3,
      flags: {
        acceptCard: false,
        stampCard: false,
      },
      openingHours: {
        opens: '09:00',
        closes: '21:00',
      },
      mapsUrl: 'https://maps.app.goo.gl/ADmwsBPCN2GncvLUA',
      tel: '0123456789',
    },
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
