import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from '../interfaces/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = 'https://localhost:7030/api/booking/';

  getTotalBooking(userId: string) {
    return this.http.get<any>(`${this.baseUrl}GetTotalCars/` + userId);
  }

  createBooking(obj: Booking, offset: number) {
    return this.http.post<any>(`${this.baseUrl}Booking/` + offset, obj);
  }

  getBooking(userId: string) {
    return this.http.get<any>(`${this.baseUrl}GetAllBookings/` + userId);
  }
}
