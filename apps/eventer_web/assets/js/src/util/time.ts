import { format, parseISO } from 'date-fns';

type formatTimeT = (t: string) => string;
export const formatTime: formatTimeT = time => {
  const date = parseISO(time);
  return format(date, 'd. LLL, yyyy. | h:mm a');
};

export const getDateString: formatTimeT = time => {
  const date = parseISO(time);
  return format(date, 'd. LLL, yyyy.')
}

export const getTimeString: formatTimeT = time => {
  const date = parseISO(time);
  return format(date, 'h:mm a')
}
