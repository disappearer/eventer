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
  console.log("initFirebase -> firebaseConfig", firebaseConfig)
  console.log("initFirebase -> vapidKey", vapidKey)
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
      // showToken('Error retrieving Instance ID token. ', err);
      // setTokenSentToServer(false);
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
    if(!firebaseInitialized && !data.isEmpty()) {
      initFirebase();
    }
  }, [data, firebaseInitialized, setFirebaseInitialized])
}
