import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginReq, LoginRes } from 'src/app/shared/model/auth.model';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ZendeskService } from 'src/app/shared/service/zendesk.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  passwordShow: boolean = true;
  submitError: boolean = false;
  paramsObject: any = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private zendeskService: ZendeskService
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.paramsObject = params;
    });
    // http://localhost:4200/auth/login?brand_id=16482819213329&locale_id=1&return_to=https:%2F%2Fsupport.123stores.com%2Fhc%2Fen-us&timestamp=1688387072
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  submitForm(): void {
    this.submitError = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      const dataReq: LoginReq = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      };
      this.authService.login(dataReq).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: any = result?.response ?? {};
            this.message.success('User Login Successful');
            this.authService.setAccessToken(res.access_token);
            this.authService.setRefreshToken(res.refresh_token);
            this.authService.saveUser(res.user_profile);
            if (
              this.paramsObject?.return_to?.includes('support.123stores.com')
            ) {
              this.zendeskService.zendeskHelp().subscribe({
                next: (res: any) => {
                  if (res.url) {
                    // window.open(res?.url);
                    var a = document.createElement('a');
                    a.href = res?.url;
                    a.click();
                  }
                  this.isLoading = false;
                },
                error: (err) => (this.isLoading = false),
              });
            } else {
              this.router.navigate(['/main/dashboard']);
              this.isLoading = false;
            }
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'User login failed!'
            );
            this.isLoading = false;
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('User login failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }
}
