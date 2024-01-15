import { Injectable } from '@angular/core';
import { Car } from '../interfaces/car';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  
  constructor(private http: HttpClient) {}
  private baseUrl: string = 'https://localhost:7030/api/car/';

  getTotalCars(userId: string) {
    return this.http.get<any>(`${this.baseUrl}GetTotalCars/` + userId);
  }

  createCarBooking(obj: Car, offset : number) {
    return this.http.post<any>(`${this.baseUrl}Create/` + offset, obj);
  }

  getAllCompanies() {
    return this.http.get(`${this.baseUrl}GetAllCompanies`);
  }

  getAllTimezones() {
    return this.http.get<any>(`${this.baseUrl}GetAllTimezones`);
  }

  getAllCars(userId: string) {
    return this.http.get(`${this.baseUrl}GetCarsByUserId/` + userId);
  }

  getCarById(carId: number) {
    return this.http.get(`${this.baseUrl}GetCarById/` + carId);
  }

  getCarByCompanyName(companyName: string) {
    return this.http.get(`${this.baseUrl}GetCarsByCompanyName/` + companyName);
  }

  editCar(carId: number, obj: Car, offset : number) {
    return this.http.put(`${this.baseUrl}Update/` + carId + "?offset=" + offset, obj);
  }

  deleteCar(carId: number) {
    return this.http.delete(`${this.baseUrl}Delete/` + carId);
  }
}
