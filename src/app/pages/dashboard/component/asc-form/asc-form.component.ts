import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/shared/service/breadcrumb.service';

@Component({
  selector: 'app-asc-form',
  templateUrl: './asc-form.component.html',
  styleUrls: ['./asc-form.component.scss'],
})
export class AscFormComponent implements OnInit {
  ascSetupForm!: FormGroup;
  reTypeAccountNumber: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.breadcrumbs.next(this.activatedRoute.snapshot.url);
    console.log(this.activatedRoute.snapshot.url);
  }

  ngOnInit(): void {
    this.ascSetupForm = new FormGroup({
      name_of_account: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(22),
        Validators.pattern('^[A-Za-z0-9_.]+$'),
      ]),
      account_number: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(17),
        Validators.pattern('^[0-9_.]+$'),
      ]),
      re_type_account_number: new FormControl(''),
      bank_name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern('^[A-Za-z0-9_.]+$'),
      ]),
      routing_transfer_number: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern('^[0-9_.]+$'),
      ]),
    });
  }

  reTypeAccount(event: any) {
    this.reTypeAccountNumber = event.target.value;
    if (
      this.ascSetupForm.value.account_number ===
      this.ascSetupForm.value.re_type_account_number
    ) {
      this.reTypeAccountNumber = false;
    } else {
      this.reTypeAccountNumber = true;
    }
  }
}