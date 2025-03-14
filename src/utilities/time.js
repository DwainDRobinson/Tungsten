'use strict';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const fancyTimeFormat = duration => {
  const pad = s => (s < 10 ? '0' : '') + s;
  // Hours, minutes and seconds
  const hours = Math.floor(duration / (60 * 60));
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};

const getCurrentUTCTimestampFormatted = () =>
  dayjs().utc().format('YYYY-MM-DD HH:mm:ss');

export { fancyTimeFormat, getCurrentUTCTimestampFormatted };
