import { format, parseISO } from 'date-fns';

type formatTimeT = (t: string) => string;
export const formatTime: formatTimeT = time => {
  const date = parseISO(time);
  return format(date, 'd. LLL, yyyy. | h:mm a');
};
