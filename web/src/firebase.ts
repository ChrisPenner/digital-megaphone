import firebase from '@firebase/app';

// Imported for side effects
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/analytics';
import { FirebaseFirestore, CollectionReference } from '@firebase/firestore-types';
import { FirebaseApp } from '@firebase/app-types';

export const app: FirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAO4Yiah0bHPTaR4Iy8AgYB3tNTqXnKJ8A',
  authDomain: 'digital-megaphone.firebaseapp.com',
  databaseURL: 'https://digital-megaphone.firebaseio.com',
  projectId: 'digital-megaphone',
  storageBucket: 'digital-megaphone.appspot.com',
  messagingSenderId: '575640775047',
  appId: '1:575640775047:web:208a9ebc29ebb3d511cb22',
  measurementId: 'G-QFY4P092Y0',
});

app.analytics();
app.auth().useDeviceLanguage();

export const db: FirebaseFirestore = app['firestore']()
export const links: CollectionReference = db.collection('links');

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'https://digital-megaphone.web.app',
  handleCodeInApp: true,
};

export async function emailLinkSignIn(email: string): Promise<boolean> {
  try {
    await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  } catch (e) {
    console.error(e)
    return false;
  }
  // The link was successfully sent. Inform the user.
  // Save the email locally so you don't need to ask the user for it again
  // if they open the link on the same device.
  window.localStorage.setItem('emailForSignIn', email);
  return true
}

export function completeEmailLinkSignIn() {
  // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn');
    console.log('logging in to', email);
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then(function (result) {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        console.log('logged in!')
        console.log(result.additionalUserInfo);
      })
      .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        console.error(error);
      });
  }
}
