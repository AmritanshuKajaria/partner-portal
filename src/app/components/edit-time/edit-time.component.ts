import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-edit-time',
  templateUrl: './edit-time.component.html',
  styleUrls: ['./edit-time.component.scss'],
})
export class EditTimeComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input()
  editData!: {
    mpn: string;
    current: number;
    extraData?: any;
    sku?: string;
  };
  @Input() editLabel: string[] = [];
  @Input() section: string = '';
  @Input() extraData: any;
  @Output() close = new EventEmitter();
  editTimeForm!: FormGroup;
  isLoading: boolean = false;
  submitError: boolean = false;

  referenceCode = '';

  constructor(
    private productService: ProductService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.editTimeForm = new FormGroup({
      new: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.submitError = true;
    if (this.editTimeForm.valid) {
      this.isLoading = true;
      let data: any = {
        product: {
          mpn: this.editData.mpn,
          sku: this.editData.sku,
        },
      };
      switch (this.section) {
        case 'Handling Time':
          data.product['handling_time'] = this.editTimeForm.value.new;
          break;
        case 'Unit Price':
          data.product['unit_price'] = this.editTimeForm.value.new;
          break;
        case 'MAP Conflict':
          data.product['map'] = this.editTimeForm.value.new;
          break;
        case 'Amazon ASIN':
          data.product['asin'] = this.editTimeForm.value.new;
          break;
        case 'Stranded In Catalog':
          data.product['product_status'] = this.editTimeForm.value.new;
          break;
        case 'Discontinued Update':
          data.product['product_status'] = this.editTimeForm.value.new;
          break;
      }
      this.productService.editProduct(data).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: any = result?.response ?? {};
            this.referenceCode = res?.reference_code;
            this.handleCancel();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Edit product fail!'
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Edit product fail!');
          }
          this.isLoading = false;
        },
      });
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.close.emit();
  }

  navigateAsin(asin: string) {
    window.open(`https://www.amazon.com/dp/${asin}`);
  }
}
