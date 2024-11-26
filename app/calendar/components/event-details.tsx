import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarEvent } from "../types";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventDetailsProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  if (!event) return null;

  const formatDateTime = (dateTimeStr: string) => {
    const date = parseISO(dateTimeStr);
    return format(date, "yyyy-MM-dd HH:mm", { locale: enUS });
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{event.summary}</DrawerTitle>
        <DrawerDescription>
          {formatDateTime(event.start.dateTime)} -{" "}
          {formatDateTime(event.end.dateTime)}
        </DrawerDescription>
      </DrawerHeader>

      <ScrollArea className="h-[50vh] px-4">
        <div className="space-y-4">
          {event.description && (
            <div className="whitespace-pre-wrap">{event.description}</div>
          )}
        </div>
      </ScrollArea>

      <DrawerFooter>
        <Button variant="outline" onClick={onClose}>
          閉じる
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

