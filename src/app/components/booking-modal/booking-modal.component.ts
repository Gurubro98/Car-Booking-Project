import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import TimeConversion from 'src/app/helpers/time-conversion';
import ValidateForm from 'src/app/helpers/validate-form';
import { Car } from 'src/app/interfaces/car';
import { Company } from 'src/app/interfaces/company';
import { DateRange } from 'src/app/interfaces/date-range';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { CarService } from 'src/app/services/car.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css'],
})
export class BookingModalComponent implements OnInit {
  bookingForm!: FormGroup;
  userId!: string;
  selectedCompany!: string;
  selectedCar!: Car;
  companies: Company[] = [];
  cars: Car[] = [];
  disable: boolean = false;
  selectedDate!: Date[];
  totalFare!: number;
  timezone!: any;
  offset!: number;
  currentDate!: Date;
  minDate!: Date;
  maxDate!: Date;
  hoursDifference!: number;
  @Output() event = new EventEmitter<string>();

  constructor(
    private carService: CarService,
    private fb: FormBuilder,
    private auth: AuthService,
    private userStore: UserStoreService,
    private bookingService: BookingService,
    private modelRef: BsModalRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    // get current userId
    this.userStore.getIdFromToken().subscribe((val) => {
      let userIdFromToken = this.auth.getIdFromToken();
      this.userId = val || userIdFromToken;
    });

    // get current timezone
    this.timezone = this.userStore.getOffset();
    this.offset = this.timezone?.source._value.offset;

    this.disable = !!this.selectedCompany;
    this.carService.getAllCompanies().subscribe((res: any) => {
      console.log(res);
      this.companies = res;
    });

    this.bookingForm = this.fb.group({
      companyId: ['', [Validators.required]],
      carId: ['', [Validators.required]],
      dateRange: ['', [Validators.required]],
      totalPrice: [],
      userId: [this.userId],
    });
  }

  getCarName(event: any) {
    this.selectedCompany = event.value;
    this.disable = true;
    this.carService
      .getCarByCompanyName(this.selectedCompany)
      .subscribe((res: any) => {
        console.log(res);
        this.cars = res.cars;
      });

    // this.carService
  }

  getCar(event: any) {
    console.log(event);
    this.selectedCar = event.value;
    this.minDate = new Date(this.selectedCar.startDate);
    console.log(this.minDate);
    this.maxDate = new Date(this.selectedCar.endDate);
  }

  getDate() {
    console.log(this.selectedDate);
    let startDate = this.selectedDate[0];
    let endDate = this.selectedDate[1];
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to hours
    this.hoursDifference = timeDifferenceMs / (1000 * 60 * 60);
    this.hoursDifference = parseFloat((Math.round(this.hoursDifference * 100) / 100).toFixed(2));
    this.totalFare = this.selectedCar.fare * this.hoursDifference;
    console.log(this.hoursDifference);
  }

  convertToLocalTime(date: string) {
    return TimeConversion.convertUtcToLocalTime(date, this.offset);
  }

  onClose() {
    this.modelRef.hide();
  }

  onBookingCar() {
    debugger;
    this.bookingForm.value.totalPrice = this.totalFare;
    this.bookingForm.value.carId = this.selectedCar.carId;
    this.bookingForm.value.companyId = this.selectedCar.companyId;
    if (this.bookingForm.valid) {
      debugger;
      this.bookingForm.value.dateRange = TimeConversion.convertUtcToLocalDate(
        this.bookingForm.value.dateRange
      );
      this.offset = moment.duration(this.offset).asMinutes();
      this.bookingService
        .createBooking(this.bookingForm.value, this.offset)
        .subscribe((res) => {
          this.modelRef.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking successfully',
          });
          this.event.emit('ok');
        });
    } else {
      ValidateForm.validateAllFormFields(this.bookingForm);
    }
  }
}
