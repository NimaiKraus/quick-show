export const getHoursAndMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const isoTimeFormat = (dateString: string) => {
  const date = new Date(dateString);
  const localTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return localTime;
};

export const isoDateFormat = (dateString: string) => {
  const date = new Date(dateString);
  const localDate = date.toLocaleDateString([], {
    weekday: "short",
    minute: "numeric",
    hour: "numeric",
    month: "long",
    day: "numeric",
  });
  return localDate;
};

export const formatNumberWithK = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};
