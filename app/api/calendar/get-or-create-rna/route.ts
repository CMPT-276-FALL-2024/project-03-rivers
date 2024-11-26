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

    try {
      // RNAカレンダーを検索
      console.log('Calendar list will be fetched...');
      const calendarList = await calendar.calendarList.list();
      console.log('Calendar list fetched:', calendarList.data);
      
      const rnaCalendar = calendarList.data.items?.find(cal => cal.summary === 'RNA');

      if (rnaCalendar) {
        // RNAカレンダーが存在する場合
        console.log('RNA calendar found:', rnaCalendar.id);
        return NextResponse.json({ 
          success: true, 
          calendarId: rnaCalendar.id 
        });
      }

      // RNAカレンダーが存在しない場合、新規作成
      console.log('New calendar will be created...');
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
      console.log('New calendar added to user\'s calendar list');

      return NextResponse.json({ 
        success: true, 
        calendarId: newCalendar.data.id 
      });

    } catch (calendarError) {
      console.error('Error getting or creating RNA calendar:', calendarError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to get or create RNA calendar: ${calendarError instanceof Error ? calendarError.message : 'Unknown error'}`,
          details: calendarError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Top level error of get-or-create-rna:', error);
    
    let errorMessage = 'Unknown error occurred';
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

