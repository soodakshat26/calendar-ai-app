// src/lib/admin.ts

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// 1) If you have a service account JSON file, require it here
//    or read from environment variables
//    e.g. serviceAccountKey.json is .gitignored
// const serviceAccount = require('../../serviceAccountKey.json');

if (!getApps().length) {
  admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    // Or if you store keys in environment variables:
    credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = admin.firestore();
