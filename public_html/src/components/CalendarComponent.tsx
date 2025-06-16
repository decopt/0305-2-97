
import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarComponentProps {
  highlightedDates?: Date[];
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CalendarComponent = ({ 
  highlightedDates = [], 
  onDateSelect,
  className 
}: CalendarComponentProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelect && onDateSelect(selectedDate);
    }
  };
  
  return (
    <Card className={cn("shadow-md border-0 overflow-hidden", className)}>
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span className="capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePreviousMonth} className="rounded-full hover:bg-primary/10 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                setDate(today);
                onDateSelect && onDateSelect(today);
              }}
              className="hover:bg-primary/10 hover:text-primary font-medium text-sm"
            >
              Hoje
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-full hover:bg-primary/10 hover:text-primary">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CalendarUI
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={ptBR}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="mx-auto pointer-events-auto"
          modifiers={{
            highlighted: highlightedDates,
            booked: highlightedDates
          }}
          modifiersClassNames={{
            highlighted: "bg-primary/10 text-primary font-medium",
            booked: "ring-2 ring-primary ring-offset-1"
          }}
          footer={
            highlightedDates.length > 0 && (
              <div className="mt-4 pt-4 border-t text-xs text-center flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary"></div>
                  <span className="text-gray-600">Com agendamentos</span>
                </div>
              </div>
            )
          }
        />
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;
