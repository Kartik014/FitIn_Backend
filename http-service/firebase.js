import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "test-5c719.appspot.com",
});

const bucket = admin.storage().bucket();

export default bucket;
