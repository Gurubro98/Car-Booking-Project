import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Login/Login.component';
import { RegisterComponent } from './components/Register/Register.component';
import { CreateCarBookingComponent } from './components/create-car-booking/create-car-booking.component';
import { CarListingComponent } from './components/car-listing/car-listing.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarBookingComponent } from './components/car-booking/car-booking.component';
import { carResolver } from './guards/resolve.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate : [authGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'booking', component: CarBookingComponent, canActivate: [authGuard] },

  {
    path: 'car-listing',
    component: CarListingComponent,
    canActivate: [authGuard],
    resolve : {
      data : carResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
