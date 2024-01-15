import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import TimeConversion from 'src/app/helpers/time-conversion';
import convertUtcToLocalDate from 'src/app/helpers/time-conversion';
import ValidateForm from 'src/app/helpers/validate-form';
import { Company } from 'src/app/interfaces/company';
import { DateRange } from 'src/app/interfaces/date-range';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-create-car-booking',
  templateUrl: './create-car-booking.component.html',
  styleUrls: ['./create-car-booking.component.css'],
})
export class CreateCarBookingComponent implements OnInit {
  carBookingForm!: FormGroup;
  userId!: string;
  carId!: number;
  companies: Company[] = [];
  timezone!: any;
  offset!: number;
  currentDate!  : Date;
  dates: Date[] = [];
  @Output() event = new EventEmitter<string>();
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private carService: CarService,
    private userStore: UserStoreService,
    private modalRef: BsModalRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentDate = new Date();
    // get current userId
    this.userStore.getIdFromToken().subscribe((val) => {
      let userIdFromToken = this.auth.getIdFromToken();
      this.userId = val || userIdFromToken;
    });

    this.timezone = this.userStore.getOffset();
    this.offset = this.timezone?.source._value.offset;
    // get all companies
    this.carService.getAllCompanies().subscribe((res: any) => {
      this.companies = res;
    });
    if (this.carId) {
      this.carService.getCarById(this.carId).subscribe((res: any) => {
        res.startDate = TimeConversion.convertUtcToLocalTime(res.startDate, this.offset);
        res.endDate = TimeConversion.convertUtcToLocalTime(res.endDate, this.offset);
        this.dates.push(new Date(res.startDate));
        this.dates.push(new Date(res.endDate));
        this.carBookingForm.patchValue(res);
        this.carBookingForm.patchValue({ availability: this.dates });
      });
    }
    this.carBookingForm = this.fb.group({
      carId: [0],
      carName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      number: ['', [Validators.required]],
      availability: ['', [Validators.required]],
      slots: ['', [Validators.required]],
      fare: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      userId: [this.userId],
    });
  }

  // get all filed
  get f() {
    return this.carBookingForm.controls;
  }

  onClose() {
    this.modalRef.hide();
  }

  onCreateCar() {
    if (this.carBookingForm.valid) {
      this.carBookingForm.value.availability =
        TimeConversion.convertUtcToLocalDate(
          this.carBookingForm.value.availability
        );
      this.offset = moment.duration(this.offset).asMinutes();
      this.carService
        .createCarBooking(this.carBookingForm.value, this.offset)
        .subscribe({
          next: (res) => {
            this.carBookingForm.reset();
            this.modalRef.hide();
            this.event.emit('ok');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Car Data Created successfully',
            });
          },
          error: (err) => {
            console.log(err?.error.message);
          },
        });
    } else {
      ValidateForm.validateAllFormFields(this.carBookingForm);
    }
  }

  onUpdateCar() {
    if (this.carBookingForm.valid) {
      this.carBookingForm.value.availability =
        TimeConversion.convertUtcToLocalDate(
          this.carBookingForm.value.availability
        );
      this.offset = moment.duration(this.offset).asMinutes();
      this.carService
        .editCar(this.carId, this.carBookingForm.value, this.offset)
        .subscribe({
          next: (res) => {
            this.carBookingForm.reset();
            this.modalRef.hide();
            this.event.emit('ok');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Car Data Updated successfully',
            });
          },
          error: (err) => {
            console.log(err?.error.message);
          },
        });
    } else {
      ValidateForm.validateAllFormFields(this.carBookingForm);
    }
  }
}
