import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TimezoneModalComponent } from '../timezone-modal/timezone-modal.component';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CarService } from 'src/app/services/car.service';
import { Car } from 'src/app/interfaces/car';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  modalRef!: BsModalRef;
  userId!: string;
  selectedTimezone!: string;
  totalCars! : number;
  totalBookings! : number;
  constructor(
    private modalService: BsModalService,
    private userStore: UserStoreService,
    private auth: AuthService,
    private carService: CarService,
    private booking : BookingService
  ) {}

  ngOnInit() {
    // get current userId
    this.userStore.getIdFromToken().subscribe((val) => {
      let userIdFromToken = this.auth.getIdFromToken();
      this.userId = val || userIdFromToken;
    });
    if (!this.selectedTimezone) {
      const config: ModalOptions = {
        backdrop: 'static',
        keyboard: false,
        animated: true,
        ignoreBackdropClick: true,
      };
      this.modalRef = this.modalService.show(TimezoneModalComponent, config);
      this.modalRef.content.event.subscribe((result: any) => {
       this.selectedTimezone = result.name;
        this.userStore.setOffset(result);
      });
    }

    this.carService.getTotalCars(this.userId).subscribe({
      next: (res: any) => {
        this.totalCars = res.totalCars;
      },
      error: (res: any) => {
        console.log(res.message);
      },
    });

    this.booking.getTotalBooking(this.userId).subscribe((res) => {
      this.totalBookings = res.totalBookings;
    });
  }
}
