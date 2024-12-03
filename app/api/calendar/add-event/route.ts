//@app/api/calendar/add-event/route.ts

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { event, calendarId } = await request.json();
    const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token not found' },
        { status: 401 }
      );
    }

    // OAuth2 Client configuration
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });

    console.log('Adding event to calendar:', {
      calendarId,
      event: {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end
      }
    });

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.dateTime,
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: event.end.dateTime,
          timeZone: 'Asia/Tokyo'
        }
      },
    });

    console.log('Event added successfully:', response.data);

    return NextResponse.json({ 
      success: true, 
      eventId: response.data.id 
    });
  } catch (error) {
    console.error('Error in calendar API route:', error);
    
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

