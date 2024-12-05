import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { timeMin, timeMax } = await request.json();
    const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token not found' },
        { status: 401 }
      );
    }


    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });


    console.log('Fetching calendar list...');
    const calendarList = await calendar.calendarList.list();
    console.log('Calendar list:', calendarList.data);
    
    const rnaCalendar = calendarList.data.items?.find(cal => cal.summary === 'RNA');

    if (!rnaCalendar?.id) {
      console.error('RNA calendar not found');
      return NextResponse.json({ 
        success: false, 
        error: 'RNA calendar not found' 
      });
    }

    console.log('RNA calendar found:', rnaCalendar.id);

   
    console.log('Fetching events...');
    const response = await calendar.events.list({
      calendarId: rnaCalendar.id,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Events fetched:', response.data.items?.length || 0);

    return NextResponse.json({ 
      success: true, 
      events: response.data.items 
    });
  } catch (error) {
    console.error('Error in get events API route:', error);
    
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}

