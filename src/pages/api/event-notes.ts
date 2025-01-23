import { NextApiRequest, NextApiResponse } from "next";
import { getSessionCookie } from "../../lib/auth/withSession";
import { db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserSession } from "../../lib/types";

export default async function eventNotesHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSessionCookie(req) as UserSession | null;
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId } = session;

  if (req.method === "POST") {
    // body: { eventId, noteText }
    const { eventId, noteText } = req.body;
    if (!eventId || typeof noteText !== "string") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      const notesRef = doc(db, `users/${userId}/eventNotes`, eventId);
      await setDoc(notesRef, { noteText, updatedAt: new Date().toISOString() });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error saving event note:", error);
      return res.status(500).json({ error: "Failed to save note" });
    }
  } else if (req.method === "GET") {
    // query: eventId?
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ error: "No eventId provided" });
    }

    try {
      const noteDoc = doc(db, `users/${userId}/eventNotes`, eventId as string);
      const snapshot = await getDoc(noteDoc);
      if (snapshot.exists()) {
        return res.status(200).json(snapshot.data());
      } else {
        return res.status(404).json({ error: "Note not found" });
      }
    } catch (error) {
      console.error("Error retrieving event note:", error);
      return res.status(500).json({ error: "Failed to retrieve note" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
