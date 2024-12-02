import { useState } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Trash2 } from 'lucide-react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

interface EventDetailsProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete: (eventId: string) => Promise<void>;
}

export function EventDetails({ event, onClose, onDelete }: EventDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!event) return null;

  const formatDateTime = (dateTimeStr: string) => {
    const date = parseISO(dateTimeStr);
    return format(date, "yyyy-MM-dd HH:mm", { locale: enUS });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted from your calendar.",
      });
      onClose();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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

      <DrawerFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Trash2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

