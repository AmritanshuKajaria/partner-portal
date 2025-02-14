import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResetPasswordReq } from 'src/app/shared/model/auth.model';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  isLoading: boolean = false;
  passwordShow: boolean = true;
  newPasswordShow: boolean = true;
  resetForm!: FormGroup;
  token: string = '';
  passwordValidationStatus = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  symbolTooltipLabel = 'Symbols: ~`!@#$%^&*()_-+={[}]|:;"\'<,>.?/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';
  }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.resetForm.controls['newPassword'].valueChanges.subscribe((value) => {
      this.validatePassword(value);
      this.resetForm.controls['confirmPassword'].value && this.checkPassword();
    });
  }

  checkPassword() {
    const newPassword = this.resetForm.controls['newPassword'].value;
    const confirmPassword = this.resetForm.controls['confirmPassword'].value;

    if (!confirmPassword) {
      this.resetForm.get('confirmPassword')?.setErrors({ required: true });
    } else if (newPassword !== confirmPassword) {
      this.resetForm.get('confirmPassword')?.setErrors({
        customError: 'Password does not match',
      });
    } else {
      this.resetForm.get('confirmPassword')?.setErrors(null);
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
      this.resetForm.get('newPassword')?.setErrors({ required: true });
      return;
    }

    if (!isValidPassword) {
      this.resetForm.get('newPassword')?.setErrors({
        customError: 'Password must meet all conditions',
      });
    }
  }

  submitForm(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      if (this.token) {
        const req: ResetPasswordReq = {
          verification_token: this.token,
          new_password: this.resetForm.controls['newPassword'].value,
        };
        this.authService.resetPassword(req).subscribe({
          next: (result: any) => {
            this.isLoading = false;
            if (result.success) {
              this.message.success('Reset Password Successful');

              // this.authService.setAccessToken(result.access_token);
              // this.authService.setRefreshToken(result.refresh_token);
              // this.authService.saveUser(result.user_profile);

              // if (result.user_profile.is_first) {
              //   this.router.navigate(['/auth/reset-password']);
              // } else {
              this.router.navigate(['/auth/login']);
              // }
            } else {
              this.message.error(
                result?.error_message
                  ? result?.error_message
                  : 'Reset Password Failed'
              );
            }
          },
          error: (err) => {
            if (!err?.error_shown) {
              this.message.error('Reset Password Failed');
            }
            this.isLoading = false;
          },
        });
        // } else {
        //   const req: ChangePasswordToken = {
        //     token: this.token,
        //     password: this.resetForm.controls['newPassword'].value,
        //   };
        //   this.authService.changePasswordToken(req).subscribe(
        //     (result: any) => {
        //       this.isLoading = false;
        //       if (result.success) {
        //         this.message.success('Forgot password successfully!!');
        //         this.router.navigate(['/auth/login']);
        //       }
        //     },
        //     (err) => (this.isLoading = false)
        //   );
      }
    }
  }
}
