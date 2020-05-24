import * as firebase from 'firebase/app';
import { firebaseConfig, vapidKey } from '../../../firebaseData';
import { UAParser } from 'ua-parser-js';
import { addFirebaseToken } from './userService';
import '@firebase/messaging';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../common/store';
import { userT } from '../features/authentication/userReducer';
import { useEffect, useState } from 'react';

const uaParser = new UAParser();

type getOSAndBrowserT = () => { os: string; browser: string };
const getOSAndBrowser: getOSAndBrowserT = () => {
  return {
    os: uaParser.getOS().name || 'unknown',
    browser: uaParser.getBrowser().name || 'unknown',
  };
};

const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(vapidKey);

  messaging
    .getToken()
    .then((currentToken: string) => {
      if (currentToken) {
        const { os, browser } = getOSAndBrowser();
        addFirebaseToken({
          token: currentToken,
          os,
          browser,
        });
      } else {
        // Show permission request.
        console.log(
          'No Instance ID token available. Request permission to generate one.',
        );
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      const nav = navigator as Navigator & {
        brave: boolean;
      };
      if (nav.brave) {
        alert(
          `Push notifications registration failed.\nSince you are using Brave, please make sure to enable "Use Google Services for Push Messaging" option in the "Privacy and security" section of the browser preferences.`,
        );
      }
    });

  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then((refreshedToken) => {
        const { os, browser } = getOSAndBrowser();
        addFirebaseToken({
          token: refreshedToken,
          os,
          browser,
        });
      })
      .catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
      });
  });

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });
};

export const useFirebase = () => {
  const { data } = useSelector<reduxStateT, userT>(({ user }) => user);

  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (!firebaseInitialized && !data.isEmpty()) {
      initFirebase();
    }
  }, [data, firebaseInitialized, setFirebaseInitialized]);
};
