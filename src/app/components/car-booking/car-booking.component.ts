import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { BookingService } from 'src/app/services/booking.service';
import { Booking } from 'src/app/interfaces/booking';

@Component({
  selector: 'app-car-booking',
  templateUrl: './car-booking.component.html',
  styleUrls: ['./car-booking.component.css'],
})
export class CarBookingComponent implements OnInit {
  modalRef!: BsModalRef;
  bookingData: Booking[] = [];
  userId!: string;
  constructor(
    private booking: BookingService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    // get current userId
    this.userStore.getIdFromToken().subscribe((val) => {
      let userIdFromToken = this.auth.getIdFromToken();
      this.userId = val || userIdFromToken;
    });

    this.onloadBookingData();
  }

  onloadBookingData() {
    this.booking.getBooking(this.userId).subscribe((res) => {
      this.bookingData = res;
    });
  }

  onBooking() {
    this.modalRef = this.modalService.show(BookingModalComponent);
    this.modalRef.content.event.subscribe((result: any) => {
      debugger;
      if (result == 'ok') {
        this.onloadBookingData();
      }
    });
  }
}
