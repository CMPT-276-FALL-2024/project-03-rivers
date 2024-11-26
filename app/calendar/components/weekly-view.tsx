import { addDays, format, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklyViewProps {
  events: any[];
  selectedDate: Date;
  isLoading: boolean;
  onEventClick: (event: any) => void;
}

export function WeeklyView({ events, selectedDate, isLoading, onEventClick }: WeeklyViewProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, index) => (
            <div key={index} className="text-center">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getDayEvents = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => (
          <div key={index} className="text-center">
            <div className="font-medium">
              {format(date, 'E', { locale: enUS })}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(date, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {weekDays.map((date, index) => {
          const dayEvents = getDayEvents(date);
          return (
            <div key={index} className="min-h-[100px] border rounded-lg p-2">
              {dayEvents.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="mb-2 p-2 bg-primary/10 rounded cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium">{event.summary}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(event.start.dateTime), 'HH:mm')} - 
                    {format(new Date(event.end.dateTime), 'HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

