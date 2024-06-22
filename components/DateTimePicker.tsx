import clsx from "clsx";
import React, { useState } from "react";
import { isDark } from "./ToggleThemeButton";
import { useTheme } from "next-themes";

interface DateTimePickerProps {
  onDateTimeChange: (
    start: string,
    end: string,
    unixDifference: number,
    startLessThanEnd: boolean
  ) => void;
  className?: string;
}

const calculateUnixTimeDifference = (start: string, end: string): number => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  return endDate - startDate;
};

const getDefaultDateTimes = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(now.getHours() - 24);

  // Round down to the nearest minute
  now.setSeconds(0);
  now.setMilliseconds(0);

  const formatDateTime = (date: Date) => date.toISOString().slice(0, 16);

  return {
    defaultStartDateTime: formatDateTime(start),
    defaultEndDateTime: formatDateTime(now),
  };
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onDateTimeChange,
  className,
}) => {
  const { theme } = useTheme();
  const { defaultStartDateTime, defaultEndDateTime } = getDefaultDateTimes();
  const [startDateTime, setStartDateTime] =
    useState<string>(defaultStartDateTime);
  const [endDateTime, setEndDateTime] = useState<string>(defaultEndDateTime);

  const handleStartDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDateTime(e.target.value);
    const diff = calculateUnixTimeDifference(e.target.value, endDateTime);
    onDateTimeChange(e.target.value, endDateTime, diff, diff > 0);
  };

  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateTime(e.target.value);
    const diff = calculateUnixTimeDifference(startDateTime, e.target.value);
    onDateTimeChange(startDateTime, e.target.value, diff, diff > 0);
  };

  return (
    <div
      className={clsx(
        className,
        "flex flex-col lg:flex-row items-center justify-center gap-2 md:gap-8"
      )}
    >
      <div className="flex items-center gap-2">
        <label className="text-sm md:text-base">Start</label>
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={handleStartDateTimeChange}
          className="input"
          style={{ colorScheme: isDark(theme) ? "dark" : "light" }}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm md:text-base">End</label>
        <input
          type="datetime-local"
          value={endDateTime}
          onChange={handleEndDateTimeChange}
          className="input"
          style={{ colorScheme: isDark(theme) ? "dark" : "light" }}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
