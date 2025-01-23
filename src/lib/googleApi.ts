import { google } from "googleapis";

export async function getGoogleCalendarEvents(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Example: fetch events from the primary calendar
  const res = await calendar.events.list({
    calendarId: "primary",
    orderBy: "startTime",
    singleEvents: true,
  });

  return res.data.items || [];
}
