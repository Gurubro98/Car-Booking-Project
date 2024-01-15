import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Car } from 'src/app/interfaces/car';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CreateCarBookingComponent } from '../create-car-booking/create-car-booking.component';
import TimeConversion from 'src/app/helpers/time-conversion';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-listing',
  templateUrl: './car-listing.component.html',
  styleUrls: ['./car-listing.component.css'],
})
export class CarListingComponent implements OnInit {
  userId!: string;
  cars: Car[] = [];
  timezone!: any;
  offset!: number;
  modalRef!: BsModalRef;
  constructor(
    private carService: CarService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // get current userId
    this.userStore.getIdFromToken().subscribe((val) => {
      let userIdFromToken = this.auth.getIdFromToken();
      this.userId = val || userIdFromToken;
    });
    this.timezone = this.userStore.getOffset();
    this.offset = this.timezone?.source._value.offset;
    this.loadCarData();
  }

  loadCarData() {
    this.cars = this.activatedRoute.snapshot.data['data'];
    // this.carService.getAllCars(this.userId).subscribe({
    //   next: (res: any) => {
    //     this.cars = res;
    //   },
    //   error: (res: any) => {
    //     console.log(res.message);
    //   },
    // });
  }

  createCarForBooking() {
    this.modalRef = this.modalService.show(CreateCarBookingComponent);
    this.modalRef.content.event.subscribe((result: any) => {
      debugger;
      if (result == 'ok') {
        this.loadCarData();
      }
    });
  }

  convertToUtc(date: string) {
    return TimeConversion.convertUtcToLocalTime(date, this.offset);
  }

  onUpdate(carId: number) {
    debugger;
    const initialState = {
      carId: carId,
    };
    this.modalRef = this.modalService.show(CreateCarBookingComponent, {
      initialState,
    });
    this.modalRef.content.event.subscribe((result: any) => {
      if (result == 'ok') {
        this.loadCarData();
      }
    });
  }

  onDelete(carId: number) {
    const initialState = {
      carId: carId,
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState,
    });
    this.modalRef.content.event.subscribe((result: any) => {
      if (result == 'ok') {
        this.loadCarData();
      }
    });
  }
}
