import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { ReportCarrierDamagePayload } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-report-carrier-damage',
  templateUrl: './report-carrier-damage.component.html',
  styleUrls: ['./report-carrier-damage.component.scss'],
})
export class ReportCarrierDamage implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() poNo: string = '';

  isLoading: boolean = false;
  uploadedImages: any[] = [null, null, null];
  showErrors: boolean[] = [false, false, false];

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {}

  ngOnInit() {}

  close() {
    this.closeModal.emit();
  }

  validateImages(images: any[], errors: boolean[]): boolean {
    let isValid = true;
    images.forEach((image, index) => {
      if (!image) {
        errors[index] = true;
        isValid = false;
      } else {
        errors[index] = false;
      }
    });
    return isValid;
  }

  onsubmit() {
    const isValid = this.validateImages(this.uploadedImages, this.showErrors);
    if (isValid) {
      this.isLoading = true;
      const carrierDamageData: ReportCarrierDamagePayload = {
        po_no: this.poNo,
        image1: this.uploadedImages[0],
        image2: this.uploadedImages[1],
        image3: this.uploadedImages[2],
      };
      const data = new FormData();
      data.append('po_no', carrierDamageData.po_no);
      data.append('image1', carrierDamageData.image1);
      data.append('image2', carrierDamageData.image2);
      data.append('image3', carrierDamageData.image3);

      this.returnService.reportCarrierDamage(data).subscribe({
        next: (result: ApiResponse) => {
          this.isLoading = false;
          if (result.success) {
            this.message.success('Report carrier damage successfully!');
            this.close();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Report carrier damage Failed!'
            );
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          if (!error?.error_shown) {
            this.message.error('Report carrier damage Failed!');
          }
        },
      });
    }
  }

  onImageSrcChange(event: any, index: number) {
    this.uploadedImages[index] = event;
    this.showErrors[index] = false;
  }
}
