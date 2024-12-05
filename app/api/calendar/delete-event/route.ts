import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function DELETE(request: Request) {
  try {
    const { eventId } = await request.json();
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

    
    const calendarList = await calendar.calendarList.list();
    const rnaCalendar = calendarList.data.items?.find(cal => cal.summary === 'RNA');

    if (!rnaCalendar?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'RNA calendar not found' 
      });
    }

    
    await calendar.events.delete({
      calendarId: rnaCalendar.id,
      eventId: eventId,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error in delete event API route:', error);
    
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

