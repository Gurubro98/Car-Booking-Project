import { Car } from "./car";
import { Company } from "./company";
import { DateRange } from "./date-range";

export interface Booking {
    id : number;
    carId : number;
    companyId : number;
    totalPrice : number;
    startDate : string;
    dateRange : DateRange;
    endDate : string;
    userId : string;
    car : Car;
    company : Company;
}
