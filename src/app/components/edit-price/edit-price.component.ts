import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    extraData?: any;
    sku?: string;
  };
  @Input() editLabel: string[] = [];
  @Input() section: string = '';
  @Input() extraData: any;
  @Output() close = new EventEmitter();
  @Input() customValidator!: ValidatorFn;
  editPriceForm!: FormGroup;
  isLoading: boolean = false;
  submitError: boolean = false;

  constructor(
    private productService: ProductService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.editPriceForm = new FormGroup({
      new: new FormControl('', [Validators.required]),
    });

    this.editPriceForm.get('new')?.valueChanges.subscribe((value) => {
      this.onPriceChange(value);
    });
  }

  onPriceChange(value: any) {
    if (this.section === 'Unit Price') {
      const price = this.calculatePricesFromUnitPrice(
        value,
        this.extraData.shipping_cost,
        this.extraData.order_processing_fees_percentage,
        this.extraData.slab_amt,
        this.extraData.pre_slab_percentage,
        this.extraData.post_slab_percentage
      );

      const validate = this.checkIfRetailPriceCanBeUpdated(
        price.retail_price,
        this.extraData.has_map,
        this.extraData.map_price
      );

      if (validate) {
        this.editPriceForm.get('new')?.setErrors({
          customError: 'MAP exists, retail price cannot be updated',
        });
      }
    }

    if (this.section === 'Retail Price') {
      const price = this.calculatePricesFromRetailPrice(
        value,
        this.extraData.shipping_cost,
        this.extraData.order_processing_fees_percentage,
        this.extraData.slab_amt,
        this.extraData.pre_slab_percentage,
        this.extraData.post_slab_percentage
      );

      const validate = this.checkIfRetailPriceCanBeUpdated(
        price.retail_price,
        this.extraData.has_map,
        this.extraData.map_price
      );

      if (validate) {
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
        product: {
          mpn: this.editData.mpn,
          sku: this.editData.sku,
        },
      };

      switch (this.section) {
        case 'Retail Price':
          data.product['retail_price'] = this.editPriceForm.value.new;
          this.productService.editProductRetailPrice(data).subscribe(
            (res: any) => {
              if (res.success) {
                this.message.create('success', 'Edit product successfully!');
              }
              this.isLoading = false;
              this.handleCancel();
            },
            (err) => (this.isLoading = false)
          );
          break;
        case 'Unit Price':
          data.product['unit_price'] = this.editPriceForm.value.new;

          this.productService.editProduct(data).subscribe(
            (res: any) => {
              if (res.success) {
                this.message.create('success', 'Edit product successfully!');
              }
              this.isLoading = false;
              this.handleCancel();
            },
            (err) => (this.isLoading = false)
          );
          break;
      }
    }
  }

  checkIfRetailPriceCanBeUpdated(
    retail_price: number,
    has_map: number,
    map_price: number
  ) {
    return has_map === 1 && retail_price <= map_price;
  }

  calculatePricesFromUnitPrice(
    unit_price: number,
    shipping_cost: number,
    order_processing_fees_percentage: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) {
    const retail_price =
      Math.round(
        ((unit_price +
          shipping_cost +
          (slab_amt * pre_slab_percentage - slab_amt * post_slab_percentage)) /
          (1 - order_processing_fees_percentage - post_slab_percentage)) *
          100
      ) / 100;

    return {
      unit_price: unit_price,
      retail_price: retail_price,
    };
  }

  calculatePricesFromRetailPrice(
    retail_price: number,
    shipping_cost: number,
    order_processing_fees_percentage: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) {
    const commission = this.getAmazonCommission(
      retail_price,
      slab_amt,
      pre_slab_percentage,
      post_slab_percentage
    );

    const bepBeforeMpf =
      Math.round(
        (retail_price * (1 - order_processing_fees_percentage) - commission) *
          100
      ) / 100;
    const unit_price = Math.round((bepBeforeMpf - shipping_cost) * 100) / 100;

    return {
      unit_price: unit_price,
      retail_price: retail_price,
    };
  }

  getAmazonCommission = (
    retail_price: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) => {
    const commissionFirst = slab_amt * pre_slab_percentage;
    const commissionAbove = (retail_price - slab_amt) * post_slab_percentage;
    const commission =
      Math.round(commissionFirst + commissionAbove * 100) / 100;
    return commission;
  };

  handleCancel() {
    this.isVisible = false;
    this.close.emit();
  }
}
