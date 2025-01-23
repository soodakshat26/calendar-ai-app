import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSessionCookie } from "../../lib/auth/withSession";
import { UserSession } from "../../lib/types";

export default async function userPreferencesHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSessionCookie(req) as UserSession | null;
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId } = session;
  const prefDocRef = doc(db, "users", userId, "preferences", "default");

  if (req.method === "GET") {
    try {
      const snapshot = await getDoc(prefDocRef);
      if (!snapshot.exists()) {
        return res.status(200).json({}); // Return empty if no preferences
      }
      return res.status(200).json(snapshot.data());
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return res.status(500).json({ error: "Failed to fetch preferences" });
    }
  } else if (req.method === "POST") {
    // Expect preferences in body, e.g. { theme: 'dark', defaultFilter: 'week' }
    try {
      await setDoc(prefDocRef, req.body, { merge: true });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error saving preferences:", error);
      return res.status(500).json({ error: "Failed to save preferences" });
    }
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
