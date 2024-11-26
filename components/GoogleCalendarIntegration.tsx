import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarIntegrationProps {
  recipeTitle: string;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  notes: string;
  ingredients: { name: string; amount: string }[];
}

export function GoogleCalendarIntegration({ 
  recipeTitle, 
  selectedDate, 
  selectedTime, 
  notes,
  ingredients 
}: GoogleCalendarIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addToCalendar = async () => {
    const accessToken = localStorage.getItem('googleAccessToken');
    console.log('Using access token:', accessToken);

    if (!selectedDate || !selectedTime || !accessToken) {
      toast({
        title: "Error",
        description: "Selected date, time, and login with Google Account",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Set end time to 1 hour after start time
      const endDateTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000);

      const description = `
Ingredients:
${ingredients.map(i => `- ${i.name}: ${i.amount}`).join('\n')}

Notes:
${notes}
      `.trim();

      // Check if "rna" calendar exists or create it
      const calendarId = await getOrCreateRnaCalendar(accessToken);

      const event = {
        summary: `🍳 ${recipeTitle}`,
        description,
        start: {
          dateTime: eventDateTime.toISOString(),
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Tokyo'
        }
      };

      console.log('Sending event data:', event);

      const response = await fetch('/api/calendar/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ event, calendarId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add event to calendar');
      }

      toast({
        title: "Success",
        description: "Recipe added to calendar",
      });
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      let errorMessage = "Error adding event to calendar";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOrCreateRnaCalendar = async (accessToken: string): Promise<string> => {
    try {
      const response = await fetch('/api/calendar/get-or-create-rna', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API response error:', data);
        throw new Error(`Failed to get or create RNA calendar: ${data.error || 'Unknown error'}`);
      }

      if (!data.calendarId) {
        throw new Error('Calendar ID not returned from API');
      }

      return data.calendarId;
    } catch (error) {
      console.error('Error getting or creating RNA calendar:', error);
      throw error;
    }
  };

  return (
    <Button 
      onClick={addToCalendar} 
      disabled={isLoading || !selectedDate || !selectedTime}
      className="w-full"
    >
      {isLoading ? "Adding..." : "Add to Calendar"}
    </Button>
  );
}

