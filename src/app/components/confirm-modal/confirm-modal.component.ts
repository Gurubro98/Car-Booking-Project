import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent implements OnInit {
  carId!: number;
  constructor(
    private carService: CarService,
    private modalRef: BsModalRef,
    private messageService: MessageService
  ) {}
  @Output() event = new EventEmitter<string>();
  ngOnInit() {}

  onCancel() {
    this.modalRef.hide();
  }

  onConfirm() {
    this.carService.deleteCar(this.carId).subscribe((res) => {
      this.event.emit('ok');
      this.modalRef.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Car Data Deleted successfully',
      });
    });
  }
}
