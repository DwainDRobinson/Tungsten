'use strict';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hours = Math.floor(duration / (60 * 60));
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);
  const pad = s => String(s).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const getCurrentUTCTimestampFormatted = () =>
  dayjs().utc().format('YYYY-MM-DD HH:mm:ss');

const getCurrentUTCISOString = () => dayjs().utc().toISOString();

export {
  fancyTimeFormat,
  getCurrentUTCISOString,
  getCurrentUTCTimestampFormatted
};
