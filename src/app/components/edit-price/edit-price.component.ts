import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewCalculatorService } from 'src/app/shared/service/new-calculator.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-edit-price',
  templateUrl: './edit-price.component.html',
  styleUrls: ['./edit-price.component.scss'],
})
export class EditPriceComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input()
  editData!: {
    mpn: string;
    current: number;
    new: number;
    extraData?: any;
    sku?: string;
  };
  @Input() editLabel: string[] = [];
  @Input() section: string = '';
  @Input() extraData: any;
  @Output() close = new EventEmitter();
  @Output() dataSavedSuccessful = new EventEmitter<any>();
  @Input() customValidator!: ValidatorFn;
  editPriceForm!: FormGroup;
  isLoading: boolean = false;
  submitError: boolean = false;

  constructor(
    private productService: ProductService,
    private message: NzMessageService,
    private newCalculatorService: NewCalculatorService
  ) {}
  ngOnInit(): void {
    this.editPriceForm = new FormGroup({
      new: new FormControl(this.editData?.new || '', [Validators.required]),
    });

    this.editPriceForm.get('new')?.valueChanges.subscribe((value) => {
      this.onPriceChange(value);
    });
  }

  onPriceChange(value: any) {
    if (this.section === 'Unit Price') {
      const price = this.newCalculatorService.calculatePricesFromUnitPrice(
        +value,
        this.extraData.shipping_cost,
        this.extraData.order_processing_fees_percentage,
        this.extraData.slab_amt,
        this.extraData.pre_slab_percentage,
        this.extraData.post_slab_percentage
      );

      const validate = this.newCalculatorService.canRetailPriceBeUpdated(
        price.retail_price,
        this.extraData.has_map,
        this.extraData.map_price
      );

      if (!validate && value) {
        this.editPriceForm.get('new')?.setErrors({
          customError: 'MAP exists, retail price cannot be updated',
        });
      }
    }

    if (this.section === 'Retail Price') {
      const validate = this.newCalculatorService.canRetailPriceBeUpdated(
        +value,
        this.extraData.has_map,
        this.extraData.map_price
      );

      if (!validate && value) {
        this.editPriceForm.get('new')?.setErrors({
          customError: 'MAP exists, retail price cannot be updated',
        });
      }
    }
  }

  submit() {
    this.submitError = true;
    if (this.editPriceForm.valid) {
      this.isLoading = true;
      let data: any = {
        sku: this.editData.sku,
      };

      switch (this.section) {
        case 'Retail Price':
          data['retail_price'] = +this.editPriceForm.value.new;
          this.productService.editProductRetailPrice(data).subscribe(
            (res: any) => {
              if (res.success) {
                this.message.create('success', 'Edit product successfully!');
                this.handleCancel();
                this.dataSavedSuccessful.emit(true);
              } else {
                this.message.error(res?.error_message ?? 'Edit product fail!');
              }
              this.isLoading = false;
            },
            (err) => {
              this.message.error('Edit product fail!');
              this.isLoading = false;
            }
          );
          break;
        case 'Unit Price':
          data['mpn'] = this.editData.mpn;
          data['unit_price'] = +this.editPriceForm.value.new;

          this.productService.editProduct(data).subscribe(
            (res: any) => {
              if (res.success) {
                this.message.create('success', 'Edit product successfully!');
                this.handleCancel();
                this.dataSavedSuccessful.emit(true);
              } else {
                this.message.error(res?.error_message ?? 'Edit product fail!');
              }
              this.isLoading = false;
            },
            (err) => {
              this.message.error('Edit product fail!');
              this.isLoading = false;
            }
          );
          break;
      }
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.close.emit();
  }
}
