"use client";

import type * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

type ScrollableDatePickerProps = {
  value: { id: number; dateRange?: { from?: Date; to?: Date } | undefined }[];
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onDateChange: (
    id: number,
    newDateRange: { from?: Date; to?: Date } | undefined
  ) => void;
};

const ScrollableDatePicker: React.FC<ScrollableDatePickerProps> = ({
  value,
  onAddItem,
  onRemoveItem,
  onDateChange,
}) => {
  return (
    <div className="border border-zinc-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">
      {value.map((item, index) => (
        <div key={item.id} className="flex items-center mb-2 gap-5">
          {index === value.length - 1 ? (
            <Button
              type="button"
              onClick={onAddItem}
              className="mr-2 w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              +
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="mr-2 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              -
            </Button>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={`date-${item.id}`}
                variant={"outline"}
                className={cn(
                  "w-[400%] -ml-[10] justify-start text-left font-normal",
                  !item.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {item.dateRange?.from ? (
                  item.dateRange.to ? (
                    <>
                      {format(item.dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(item.dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(item.dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={item.dateRange?.from}
                selected={item.dateRange as DateRange | undefined}
                onSelect={(newDateRange) =>
                  onDateChange(item.id, newDateRange || undefined)
                }
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          <Input name="importo" placeholder="€€€" type="number" className="no-spin" />
        </div>
      ))}
    </div>
  );
};

export default ScrollableDatePicker;
