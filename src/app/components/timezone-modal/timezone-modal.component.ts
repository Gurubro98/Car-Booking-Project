import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import ValidateForm from 'src/app/helpers/validate-form';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-timezone-modal',
  templateUrl: './timezone-modal.component.html',
  styleUrls: ['./timezone-modal.component.css'],
})
export class TimezoneModalComponent implements OnInit {
  selectedTimezone: any;
  timezoneForm!: FormGroup;
  timezones: any[] = [];
  @Output() event = new EventEmitter<string>();
  constructor(
    private carService: CarService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.carService.getAllTimezones().subscribe((res: any) => {
      this.timezones = res;
    });
    this.timezoneForm = this.fb.group({
      timezone: ['', [Validators.required]],
    });
  }

  onSelectTimezone() {
    if (this.timezoneForm.valid) {
      this.event.emit(this.selectedTimezone);
      this.modalRef.hide();
    }
    else{
      ValidateForm.validateAllFormFields(this.timezoneForm);
    }
  }
}
