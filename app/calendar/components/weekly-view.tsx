//@app/calendar/components/weekly-view.tsx

import { addDays, format, isSameDay, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarEvent } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklyViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  isLoading: boolean;
  onEventClick: (event: CalendarEvent) => void;
}

export function WeeklyView({
  events,
  selectedDate,
  isLoading,
  onEventClick,
}: WeeklyViewProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i, 0, 0, 0), 'HH:mm')
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-4">
          <div className="text-center">
            <Skeleton className="h-6 w-full" />
          </div>
          {weekDays.map((_, index) => (
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

  const getEventsByTime = (date: Date, timeSlot: string) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.start.dateTime);
      const eventTime = format(eventDate, 'HH:mm');
      return isSameDay(eventDate, date) && eventTime === timeSlot;
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header row with weekdays */}
        <div className="grid grid-cols-8 gap-4">
          <div className="text-center text-muted-foreground">Time</div>
          {weekDays.map((date, index) => (
            <div key={index} className="text-center">
              <div className="font-medium">
                {format(date, "E", { locale: enUS })}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(date, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable time slots and events */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-4 min-h-[60px]">
                <div className="text-right text-sm text-muted-foreground py-2">
                  {timeSlot}
                </div>
                {weekDays.map((date, dateIndex) => {
                  const dayEvents = getEventsByTime(date, timeSlot);
                  return (
                    <div
                      key={dateIndex}
                      className="border-t relative min-h-[60px]"
                    >
                      {dayEvents.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          onClick={() => onEventClick(event)}
                          className="absolute w-full bg-primary/10 rounded p-2 cursor-pointer hover:bg-primary/20 transition-colors"
                          style={{
                            top: '0',
                            minHeight: '60px'
                          }}
                        >
                          <div className="font-medium text-sm">{event.summary}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(event.start.dateTime), "HH:mm")} -{" "}
                            {format(parseISO(event.end.dateTime), "HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

