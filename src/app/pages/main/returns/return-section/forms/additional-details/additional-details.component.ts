import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  AdditionalDetailsPayload,
  ReportCarrierDamagePayload,
} from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss'],
})
export class AdditionalDetailComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() poNo: string = '';

  isLoading: boolean = false;
  uploadedImages: any[] = [null, null, null];
  showErrors: boolean[] = [false, false, false];
  additionalDetailsForm!: FormGroup;

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.additionalDetailsForm = new FormGroup({
      remarks: new FormControl('', Validators.required),
    });
  }

  close() {
    this.closeModal.emit();
  }

  onsubmit() {
    if (this.additionalDetailsForm.invalid) {
      for (const i in this.additionalDetailsForm.controls) {
        this.additionalDetailsForm.controls[i].markAsDirty();
        this.additionalDetailsForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    this.isLoading = true;
    const carrierDamageData: AdditionalDetailsPayload = {
      remarks: this.additionalDetailsForm.value?.remarks, // TODO
      image1: this.uploadedImages[0],
      image2: this.uploadedImages[1],
      image3: this.uploadedImages[2],
    };
    const data = new FormData();
    data.append('remarks', carrierDamageData.remarks);
    data.append('image1', carrierDamageData.image1);
    data.append('image2', carrierDamageData.image2);
    data.append('image3', carrierDamageData.image3);

    this.returnService.additionalDetails(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          this.message.success('Additional details added successfully!');
          this.close();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Additional details add Failed!'
          );
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        if (!error?.error_shown) {
          this.message.error('Additional details add Failed!');
        }
      },
    });
  }

  onImageSrcChange(event: any, index: number) {
    this.uploadedImages[index] = event;
    this.showErrors[index] = false;
  }
}
