import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ForgotPasswordReq } from 'src/app/shared/model/auth.model';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean = false;
  newPasswordShow: boolean = true;
  passwordShow: boolean = true;
  forgotForm!: FormGroup;
  submitError: boolean = false;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
  }

  submitForm(): void {
    this.submitError = true;
    if (this.forgotForm.valid) {
      this.isLoading = true;
      const req: ForgotPasswordReq = {
        email: this.forgotForm.controls['email'].value,
      };
      this.authService.forgotPassword(req).subscribe({
        next: (res: ApiResponse) => {
          this.isLoading = false;
          if (res.success) {
            this.message.success('Sent mail successfully!!');
            this.router.navigate(['/auth/login']);
          } else {
            this.message.error(res?.msg ? res?.msg : 'Send mail failed!');
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Send mail failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }
}
