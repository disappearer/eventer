import '@firebase/messaging';
import * as firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { firebaseConfig, vapidKey } from '../../../firebaseData';
import { reduxStateT } from '../common/store';
import { userT } from '../features/authentication/userReducer';
import { BraveNavigator, getOSAndBrowser } from './deviceInfo';
import { useNavigation } from './navigation';
import { addFirebaseToken } from './userService';

type initFirebaseT = () => firebase.messaging.Messaging;
const initFirebase: initFirebaseT = () => {
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
      }
    })
    .catch(() => {
      const nav = navigator as BraveNavigator;
      if (nav.brave) {
        alert(
          'Push notifications registration failed.\nSince you are using Brave, it may help if you enable "Use Google Services for Push Messaging" option in the "Privacy and security" section of the browser preferences.',
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

  return messaging;
};

type checkPermissionsAndInitFirebaseT = () => Promise<
  firebase.messaging.Messaging | undefined
>;
const checkPermissionsAndInitFirebase: checkPermissionsAndInitFirebaseT = async () => {
  switch (Notification.permission) {
    case 'default':
      const value = await Notification.requestPermission();
      if (value === 'granted') {
        return initFirebase();
      }
      break;
    case 'granted':
      return initFirebase();
    default:
      return undefined;
  }
};

export const useFirebase = () => {
  const { navigate } = useNavigation();

  const { data } = useSelector<reduxStateT, userT>(({ user }) => user);
  const isTabFocused = useSelector<reduxStateT, boolean>(
    ({ notifications: { isTabFocused } }) => isTabFocused,
  );

  const [messaging, setMessaging] = useState<firebase.messaging.Messaging>();

  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (!firebaseInitialized && !data.isEmpty()) {
      checkPermissionsAndInitFirebase().then(setMessaging);
    }
  }, [data, firebaseInitialized, setFirebaseInitialized]);

  useEffect(() => {
    if (messaging) {
      messaging.onMessage((payload) => {
        const text = `${payload.notification.title}\n${payload.notification.body}`;
        if (isTabFocused) {
          toast(text, {
            onClick: () => navigate(`/events/${payload.data.id_hash}`),
            autoClose: false,
          });
        } else if (Notification.permission === 'granted') {
          const notification = new Notification(
            `"${payload.notification.title}" is active!`,
            {
              body: 'Someone wrote in the chat.',
              requireInteraction: true,
            },
          );
          notification.onclick = function () {
            window.focus();
          };
        }
      });
    }
  }, [messaging, isTabFocused]);
};
