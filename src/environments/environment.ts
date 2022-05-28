// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // firebase: {
  //   projectId: 'web-finances',
  //   appId: '1:737057594981:web:9596940201bea8a607308c',
  //   storageBucket: 'web-finances.appspot.com',
  //   apiKey: 'AIzaSyCIlnsyDeZcG_eruXmOwUdCEfQwOLDhRAI',
  //   authDomain: 'web-finances.firebaseapp.com',
  //   messagingSenderId: '737057594981',
  // },
  firebase: {
    apiKey: "AIzaSyCIlnsyDeZcG_eruXmOwUdCEfQwOLDhRAI",
    authDomain: "web-finances.firebaseapp.com",
    projectId: "web-finances",
    storageBucket: "web-finances.appspot.com",
    messagingSenderId: "737057594981",
    appId: "1:737057594981:web:9596940201bea8a607308c"
  },
  production: false,
  apiBaseUrl: 'http://localhost:8082'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
