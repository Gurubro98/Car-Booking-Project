import { Company } from './company';
import { DateRange } from './date-range';

export interface Car {
  carId: number;
  carName: string;
  number: string;
  availability: DateRange;
  slots: number;
  fare: number;
  companyId: number;
  startDate : string;
  endDate : string;
  userId: string;
  company: Company;
  isBookingActive : boolean;
}
