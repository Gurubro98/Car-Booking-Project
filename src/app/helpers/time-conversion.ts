import * as moment from 'moment';
import { DateRange } from '../interfaces/date-range';

export default class TimeConversion {
  static convertUtcToLocalDate(dateRange: string[]): DateRange {
    const localDates: Date[] = [];

    dateRange.forEach((dateString) => {
      const utcDate = new Date(dateString);
      const localOffset = utcDate.getTimezoneOffset() * 60000;
      const localTime = utcDate.getTime() - localOffset;

      const localDate = new Date(localTime);
      localDates.push(localDate);
    });
    let dates: DateRange = {
      StartDate: localDates[0],
      EndDate: localDates[1],
    };
    return dates;
  }

  static convertUtcToLocalTime(
    utcTime: string,
    timezoneOffset: number
  ): string {
    // Parse UTC time using moment.js
    const utcMoment = moment.utc(utcTime);
    timezoneOffset = moment.duration(timezoneOffset).asMinutes();
    // Adjust time based on the timezone offset
    const localMoment = utcMoment.subtract(timezoneOffset, 'minutes');
   
    // Format the local time as a string
    const formattedLocalTime = localMoment.format('YYYY-MM-DD HH:mm:ss');

    return formattedLocalTime;
  }
}
