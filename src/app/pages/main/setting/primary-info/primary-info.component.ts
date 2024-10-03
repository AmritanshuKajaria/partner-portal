import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-primary-info',
  templateUrl: './primary-info.component.html',
  styleUrls: ['./primary-info.component.scss'],
})
export class PrimaryInfoComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;

  primaryInfoForm!: FormGroup;
  dropDownList: any = null;
  primaryInfoData: any;
  formFieldOnUI = {
    displayName: true,
    accountManagerName: true,
    accountStatus: true,
    salesStatus: true,
    paymentStatus: true,
    accountReason: true,
    salesReason: true,
    paymentReason: true,
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Initialize form
    this.primaryInfoForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      accountManagerName: [{ value: '', disabled: true }],
      accountStatus: [{ value: '', disabled: true }],
      salesStatus: [{ value: '', disabled: true }],
      paymentStatus: [{ value: '', disabled: true }],
      accountReason: [{ value: '', disabled: true }],
      salesReason: [{ value: '', disabled: true }],
      paymentReason: [{ value: '', disabled: true }],
    });

     // Get API call
     this.partnerService.getPartner().subscribe({
      next: (res: any) => {
        console.log(res);
        this.primaryInfoData = res.payload;
        this.onFormChange();
        this.patchFormValue(this.primaryInfoData);
        this.isLoading = false;
      },
      error: (error) => {
        this.message.create(
          'error',
          error?.error_message?.[0] || 'Something went wrong fetching the data'
        );
        this.isLoading = false;
      },
    });

      // API calls
      forkJoin([
        this.commonService.getJsonData(),
        this.partnerService.getPartner(),
      ]).subscribe({
        next: ([jsonData, partnerData]: any) => {
           this.primaryInfoData = partnerData.payload;
        // this.onFormChange();
        this.patchFormValue(this.primaryInfoData);
          this.dropDownList = jsonData;
          this.isLoading = false;
        },
        error: (e) => {
          this.message.create('error', 'Something went wrong fetching the data');
          this.isLoading = false;
        },
      });
  }

   // Get Form Control
  get formControl() {
    return this.primaryInfoForm.controls;
  }

  // Handle hide show inputs
  onFormChange(): void {
    
    if (this.formControl['accountStatus'].value === 2) {
      this.formFieldOnUI['accountReason'] = true;
    } else {
      this.formFieldOnUI['accountReason'] = false;
    }

    if (this.formControl['salesStatus'].value === 2) {
      this.formFieldOnUI['salesReason'] = true;
    } else {
      this.formFieldOnUI['salesReason'] = false;
    }
    
    if (this.formControl['paymentStatus'].value === 2) {
      this.formFieldOnUI['paymentReason'] = true;
    } else {
      this.formFieldOnUI['paymentReason'] = false;
    }
  }

  // Reset Form
  reset() {
    this.primaryInfoForm?.reset();
    this.patchFormValue(this.primaryInfoData);
  }

  // Patch Form Value
  patchFormValue(data: any) {

    let partnerDetails = data?.partnerDetails;
    let paymentDetails = data?.paymentDetails;

    this.formControl['displayName'].setValue(partnerDetails?.displayName);
    this.formControl['accountManagerName'].setValue(partnerDetails?.accountManagerName);
    this.formControl['accountStatus'].setValue(Number(partnerDetails?.accountStatus));
    this.formControl['accountReason'].setValue(partnerDetails?.accountStatusReason);
    this.formControl['salesStatus'].setValue(Number(partnerDetails?.salesStatus));
    this.formControl['salesReason'].setValue(partnerDetails?.salesStatusReason);

    this.formControl['paymentStatus'].setValue(Number(paymentDetails?.paymentStatus));
    this.formControl['paymentReason'].setValue(paymentDetails?.paymentStatusReason);

  } 

  // Submit Form
  submitForm() {
    this.isSaving = true;
    const payload = {
      displayName: this.formFieldOnUI['displayName']
        ? this.formControl['displayName']?.value
        : '',
      accountManagerName: this.formFieldOnUI['accountManagerName']
        ? this.formControl['accountManagerName']?.value
        : '',
      accountStatus: this.formFieldOnUI['accountStatus']
        ? this.formControl['accountStatus']?.value
        : '',
      accountStatusReason: this.formFieldOnUI['accountReason']
        ? this.formControl['accountReason']?.value
        : '',
      salesStatus: this.formFieldOnUI['salesStatus']
        ? this.formControl['salesStatus']?.value
        : '',
      salesStatusReason: this.formFieldOnUI['salesReason']
        ? this.formControl['salesReason']?.value
        : '',
      paymentStatus: this.formFieldOnUI['paymentStatus']
        ? this.formControl['paymentStatus']?.value
        : '',
      paymentStatusReason: this.formFieldOnUI['paymentReason']
        ? this.formControl['paymentReason']?.value
        : '',
    };

    setTimeout(() => {
      console.log('payload::', payload);

      this.partnerService.updatePartner(payload).subscribe({
        next: (res) => {
          this.message.create('success', 'Data Updated Successfully!');
          this.isSaving = false;

          // Fetch the updated partner data after a successful update
          this.isLoading = true;
          this.partnerService.getPartner().subscribe({
            next: (res: any) => {
              this.patchFormValue(res.payload);
              this.isLoading = false;
            },
            error: (error) => {
              this.message.create(
                'error',
                error?.error_message?.[0] ||
                  'Something went wrong fetching the data'
              );
              this.isLoading = false;
            },
          });
        },
        error: (error: any) => {
          this.message.create(
            'error',
            error?.error_message?.[0] || 'Data Update failed!'
          );
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
    }, 500);
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
