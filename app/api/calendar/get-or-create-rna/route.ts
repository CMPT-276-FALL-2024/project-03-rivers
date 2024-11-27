import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token not found' },
        { status: 401 }
      );
    }

    // OAuth2クライアントの設定
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });

    try {
      // RNAカレンダーを検索
      console.log('Fetching calendar list...');
      const calendarList = await calendar.calendarList.list();
      console.log('Calendar list fetched:', calendarList.data);
      
      const rnaCalendar = calendarList.data.items?.find(cal => cal.summary === 'RNA');

      if (rnaCalendar) {
        // RNAカレンダーが存在する場合
        console.log('RNA calendar found:', rnaCalendar.id);
        return NextResponse.json({ 
          success: true, 
          calendarId: rnaCalendar.id,
          isNew: false
        });
      }

      // RNAカレンダーが存在しない場合、新規作成
      console.log('Creating new calendar...');
      const newCalendar = await calendar.calendars.insert({
        requestBody: {
          summary: 'RNA',
          description: 'Recipe and Nutrition App Calendar',
          timeZone: 'Asia/Tokyo'
        }
      });
      console.log('New calendar created:', newCalendar.data);

      await calendar.calendarList.insert({
        requestBody: {
          id: newCalendar.data.id
        }
      });
      console.log('Calendar added to calendar list');

      return NextResponse.json({ 
        success: true, 
        calendarId: newCalendar.data.id,
        isNew: true
      });

    } catch (calendarError) {
      console.error('Error getting or creating calendar:', calendarError);
      const errorMessage = calendarError instanceof Error ? calendarError.message : 'Error getting or creating calendar';
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to get or create calendar: ${errorMessage}`,
          details: calendarError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Top level error in get-or-create-rna:', error);
    
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error
      },
      { status: 500 }
    );
  }
}

