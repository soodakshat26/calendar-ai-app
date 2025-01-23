import { NextApiRequest, NextApiResponse } from "next";
import { getSessionCookie } from "../../lib/auth/withSession";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = getSessionCookie(req);
  if (!session?.accessToken) {
    return res.status(401).json({ error: "Not signed in" });
  }

  // Initialize OAuth client with the user's access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    // Make the call to fetch events
    const response = await calendar.events.list({
      calendarId: "primary", // or your specific calendar ID
      singleEvents: true,
      orderBy: "startTime",
      // timeMin: new Date().toISOString(), // remove or comment out if you want past events
    });

    console.log("Calendar API response:", response.data);

    const events = response.data.items || [];
    return res.status(200).json(events);
  } catch (error) {
    console.error("Calendar fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
}
