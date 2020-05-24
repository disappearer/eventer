import '@firebase/messaging';
import * as firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UAParser } from 'ua-parser-js';
import { firebaseConfig, vapidKey } from '../../../firebaseData';
import { reduxStateT } from '../common/store';
import { userT } from '../features/authentication/userReducer';
import { navigateT, useNavigation } from './navigation';
import { addFirebaseToken } from './userService';

type BraveNavigator = Navigator & {
  brave: boolean;
};

const uaParser = new UAParser();

type getOSAndBrowserT = () => { os: string; browser: string };
const getOSAndBrowser: getOSAndBrowserT = () => {
  const nav = navigator as BraveNavigator;
  return {
    os: uaParser.getOS().name || 'unknown',
    browser: (nav.brave && 'Brave') || uaParser.getBrowser().name || 'unknown',
  };
};

const initFirebase = (navigate: navigateT) => {
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
      const nav = navigator as BraveNavigator;
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
    const text = `${payload.notification.title}\n${payload.notification.body}`;
    toast(text, {
      onClick: () => navigate(`/events/${payload.data.id_hash}`),
      autoClose: false,
    });
    // ...
  });
};

export const useFirebase = () => {
  const { navigate } = useNavigation();
  const { data } = useSelector<reduxStateT, userT>(({ user }) => user);

  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (!firebaseInitialized && !data.isEmpty()) {
      initFirebase(navigate);
    }
  }, [data, firebaseInitialized, setFirebaseInitialized]);
};
