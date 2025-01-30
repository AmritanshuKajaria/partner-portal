import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PromoTemplate } from 'src/app/shared/model/promotion.model';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';
import { PromotionsService } from 'src/app/shared/service/promotions.service';

@Component({
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: ['./add-promotions.component.scss'],
})
export class AddPromotionsComponent implements OnInit {
  @Output() close = new EventEmitter();
  add_promotion!: FormGroup;
  isLoading: boolean = false;
  selectFile: any = '';

  AppDateFormate = AppDateFormate;
  referenceCode = '';

  showFileSizeError = false;
  maxUploadFileSize = 10;

  constructor(
    private promotionsService: PromotionsService,
    private message: NzMessageService,
    @Inject(LOCALE_ID) public locale: string
  ) {}
  ngOnInit(): void {
    this.add_promotion = new FormGroup({
      startAndEndDate: new FormControl('', [Validators.required]),
      downloadTemplate: new FormControl(''),
      uploadFile: new FormControl('', [Validators.required]),
    });
  }

  setFileName(path: string) {
    const fileName = path.replace(/\//g, ' ').substring(1).split('\\')[2];
    return fileName;
  }

  selectFiles(event: any) {
    if (event?.target?.files[0].size / 1e6 > this.maxUploadFileSize) {
      this.showFileSizeError = true;
      this.add_promotion.get('uploadFile')?.reset();
      return;
    }
    this.showFileSizeError = false;
    this.selectFile = event?.target?.files[0];
  }

  selectDownloadTemplate(event: boolean) {
    const data: PromoTemplate = {
      include_data: event,
    };
    this.promotionsService.promoTemplate(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.message.create('success', 'Template Downloaded Successfully!');
          var objectUrl = res.template_url;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        } else {
          this.message.error(
            res?.error_message ?? 'Template Downloaded Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Template Downloaded Failed!');
        }
      },
    });
  }

  submit() {
    this.isLoading = true;
    if (this.add_promotion?.valid) {
      let formData = new FormData();
      formData.append(
        'start_date',
        this.add_promotion.value.startAndEndDate[0]
          ? formatDate(
              this.add_promotion.value.startAndEndDate[0],
              'yyyy-MM-dd',
              this.locale
            )
          : ''
      );
      formData.append(
        'end_date',
        this.add_promotion.value.startAndEndDate[1]
          ? formatDate(
              this.add_promotion.value.startAndEndDate[1],
              'yyyy-MM-dd',
              this.locale
            )
          : ''
      );
      formData.append('uploaded_file', this.selectFile);

      this.promotionsService.createPromotion(formData).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            // this.message.create('success', 'Add Promotion Successful');
            this.handleCancel(res.reference_code);
          } else {
            this.message.error('Add Promotion Failed!');
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Add Promotion Failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }

  handleCancel(referenceCode = '') {
    this.close.emit(referenceCode);
  }
}
