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
  sameAsPassword: boolean = true;
  submitError: boolean = false;

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
  }

  checkPassword() {
    if (
      this.changePasswordForm.controls['newPassword'].value ===
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      this.sameAsPassword = true;
    } else {
      this.sameAsPassword = false;
    }
  }

  submitForm(): void {
    this.submitError = true;
    this.isLoading = true;
    if (this.changePasswordForm.valid) {
      const req: ChangePassword = {
        old_password: this.changePasswordForm.controls['oldPassword'].value,
        new_password: this.changePasswordForm.controls['newPassword'].value,
      };
      this.authService.changePassword(req).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.message.success('User password changed!!');
            this.router.navigate(['/main/dashboard']);
          } else {
            this.message.error(
              res?.error_message ?? 'User password change failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('User password change failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }
}
