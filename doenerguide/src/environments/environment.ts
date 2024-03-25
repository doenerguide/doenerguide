// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export var environment = {
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
      tel: '0123456789',
      lat: 51.1657,
      lng: 10.4515,
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
      tel: '0123456789',
      lat: 51.1657,
      lng: 10.4515,
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
      tel: '0123456789',
      lat: 51.1657,
      lng: 10.4515,
    },
  ],
};