import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './Register/Register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Login/Login.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CreateCarBookingComponent } from './create-car-booking/create-car-booking.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CarListingComponent } from './car-listing/car-listing.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TimezoneModalComponent } from './timezone-modal/timezone-modal.component';
import { BadgeModule } from 'primeng/badge';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MessageService } from 'primeng/api';
import { CarBookingComponent } from './car-booking/car-booking.component';
import { BookingModalComponent } from './booking-modal/booking-modal.component';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    CreateCarBookingComponent,
    CarListingComponent,
    DashboardComponent,
    TimezoneModalComponent,
    ConfirmModalComponent,
    CarBookingComponent,
    BookingModalComponent
  ],
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    ModalModule,
    FormsModule,
    BadgeModule,
    CardModule,
    InputMaskModule,
    ProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    BsModalService,
    MessageService
  ],
})
export class ComponentModule {}
