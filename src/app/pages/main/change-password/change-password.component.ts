import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangePassword } from 'src/app/shared/model/auth.model';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  isLoading: boolean = false;
  passwordShow: boolean = true;
  newPasswordShow: boolean = true;
  changePasswordForm!: FormGroup;
  passwordValidationStatus = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  symbolTooltipLabel = "Symbols: ~`!@#$%^&*()_-+={[}]|\:;\"'<,>.?/";

  constructor(
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe(
      (value) => {
        this.validatePassword(value);
        this.changePasswordForm.controls['confirmPassword'].value &&
          this.checkPassword();
      }
    );
  }

  checkPassword() {
    const newPassword = this.changePasswordForm.controls['newPassword'].value;
    const confirmPassword =
      this.changePasswordForm.controls['confirmPassword'].value;

    if (!confirmPassword) {
      this.changePasswordForm
        .get('confirmPassword')
        ?.setErrors({ required: true });
    } else if (newPassword !== confirmPassword) {
      this.changePasswordForm.get('confirmPassword')?.setErrors({
        customError: 'Password do not match.',
      });
    } else {
      this.changePasswordForm.get('confirmPassword')?.setErrors(null);
    }
  }

  validatePassword(password: string): void {
    this.passwordValidationStatus['minLength'] =
      RegExp(/^.{8,}$/).test(password);
    this.passwordValidationStatus['uppercase'] = RegExp(/[A-Z]/).test(password);
    this.passwordValidationStatus['lowercase'] = RegExp(/[a-z]/).test(password);
    this.passwordValidationStatus['number'] = RegExp(/[0-9]/).test(password);
    this.passwordValidationStatus['specialChar'] = RegExp(
      /[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/
    ).test(password);

    const isValidPassword =
      this.passwordValidationStatus.minLength &&
      this.passwordValidationStatus.uppercase &&
      this.passwordValidationStatus.lowercase &&
      this.passwordValidationStatus.number &&
      this.passwordValidationStatus.specialChar;

    if (!password) {
      this.changePasswordForm.get('newPassword')?.setErrors({ required: true });
      return;
    }

    if (!isValidPassword) {
      this.changePasswordForm.get('newPassword')?.setErrors({
        customError: 'Password must be strong',
      });
    }
  }

  submitForm(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const req: ChangePassword = {
        old_password: this.changePasswordForm.controls['oldPassword'].value,
        new_password: this.changePasswordForm.controls['newPassword'].value,
      };
      this.authService.changePassword(req).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.message.success('User password changed!!');
            this.router.navigate(['/main/dashboard']);
          } else {
            this.message.error(
              res?.error_message
                ? res?.error_message
                : 'Password change failed!'
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Password change failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }
}
