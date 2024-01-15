import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm, {
  ConfirmedValidator,
} from 'src/app/helpers/validate-form';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css'],
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        Name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^(([A-za-z]+[\\s]{1}[A-za-z]+)|([A-Za-z]+))$'),
          ],
        ],
        Email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            ),
          ],
        ],
        Password: [
          '',
          [
            Validators.required,
            Validators.minLength(7),
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{6,}'
            ),
          ],
        ],
        ConfirmPassword: ['', Validators.required],
      },
      { validator: ConfirmedValidator('Password', 'ConfirmPassword') }
    );
  }

  // get all filed
  get f() {
    return this.signupForm.controls;
  }

  onSignUp() {
    if (this.signupForm.valid) {
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err?.error.message);
        },
      });
    } else {
      console.log(' Form is not valid');
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
}
