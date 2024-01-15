import { delay } from 'rxjs/operators'; // Import your service
// Import your Car model
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Car } from '../interfaces/car';
import { CarService } from '../services/car.service';
import { Inject, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const carResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  debugger
  const carService = inject(CarService);
  const authService = inject(AuthService);
  const userId = authService.getIdFromToken(); // Assuming 'userId' is a route parameter

  // Call your service method to get all cars by userId
  return carService.getAllCars(userId);
};

// export type ResolveFn<T> = (route: ActivatedRouteSnapshot) => Observable<T>;
