/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyBGEeNqKvDGr-y2jtuozb1z9UGXnq8d8_Q',
  authDomain: 'eventer-183814.firebaseapp.com',
  databaseURL: 'https://eventer-183814.firebaseio.com',
  projectId: 'eventer-183814',
  storageBucket: 'eventer-183814.appspot.com',
  messagingSenderId: '736212459929',
  appId: '1:736212459929:web:5f8d29a2de8f85bff53308',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i += 1) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => registration.showNotification('my notification title'));
  return promiseChain;
});
self.addEventListener('notificationclick', (event) => {
  console.log(event);
});
