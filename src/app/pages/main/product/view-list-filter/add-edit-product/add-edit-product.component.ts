import { UserPermissionService } from './../../../../../shared/service/user-permission.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss'],
})
export class AddEditProductComponent implements OnInit {
  @Input() editSection: boolean = false;
  @ViewChild('addInput', { static: false }) addInput!: ElementRef;

  isImportVisible: boolean = false;
  addEditProductForm!: FormGroup;
  listOfBrand: string[] = [];
  brandIndex = 0;
  listOfCollection: string[] = [];
  collectionIndex = 0;
  listOfProductCategory: string[] = [];
  productCategoryIndex = 0;
  listOfSalesTier = [
    'Bronze - Low Performer',
    'Silver - Moderate Performer',
    'Gold - Solid Performer',
    'Platinum - High Performer',
    'Diamond - Top Performer',
  ];
  salesTierIndex = 0;
  editData: any = '';
  setDropDownValue: string = '';
  searchList: string[] = [];
  editSku: string = '';
  isLoading: boolean = false;
  isMainLoading: boolean = false;
  userPermissions: any = '';
  disabledFiled: boolean = false;
  sku: string = '';
  isVisible: boolean = false;
  referenceCode: string = '';
  resReferenceCode: string = '';
  restrictedReasonList: string[] = [
    'Component / Part',
    'Exclusive with another retailer',
    'Not to be sold on Amazon',
    'Not Available for DropShip',
    'Custom Product',
    'Partner is not the Brand Owner',
    'Fragile',
    'Other Reason',
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modal: NzModalService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private userPermissionService: UserPermissionService
  ) {
    this.sku = this.activatedRoute.snapshot.paramMap.get('sku') ?? '';
    this.userPermissionService.userPermission.subscribe((result: any) => {
      if (result.success) {
        this.listOfBrand = result.brands;
        this.listOfProductCategory = result.product_categories;
        this.listOfCollection = result.collections;
      } else {
        if (result.error_message === 'PC param missing') {
          this.message.create('warning', result.error_message);
        }
      }
    });
  }

  ngOnInit(): void {
    this.addEditProductForm = this.formBuilder.group({
      mpn: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9-=_+() .&/\\\\]*$'),
      ]),
      upc: new FormControl('', [
        Validators.minLength(12),
        Validators.maxLength(14),
        Validators.pattern('^[0-9_.]+$'),
      ]),
      amazon_asin: new FormControl('', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[A-Z0-9_.]+$'),
      ]),
      product_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      brand: new FormControl('', [
        Validators.required,
        Validators.maxLength(80),
      ]),
      collection: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(80),
      ]),
      product_category: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(80),
      ]),
      sales_tier: new FormControl('', [Validators.maxLength(34)]),
      unit_price: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(2500),
      ]),
      map: new FormControl(''),
      // msrp: new FormControl(''),
      handling_time: new FormControl('', [
        Validators.min(1),
        Validators.max(30),
      ]),
      shipping_Method: new FormControl('', [Validators.required]),
      number_of_boxes: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      product_status: new FormControl('active'),
      restricted_reason: new FormControl(''),
      shipping_dimensions_of_box: this.formBuilder.array([]),
    });
    this.userPermissionService.userPermission.subscribe((permission: any) => {
      this.userPermissions = permission;
      if (this.userPermissions.partner_sku_level_handling) {
        this.addEditProductForm.controls['handling_time'].setValidators([
          Validators.required,
        ]);
      }
    });

    if (this.editSection) {
      // this.addEditProductForm.disable();
      // this.disabledFiled = true;

      if (this.sku) {
        this.isMainLoading = true;
        this.editSku = this.sku;
        this.productService.getProduct(this.sku).subscribe(
          (res: any) => {
            if (res.success) {
              this.isMainLoading = false;
              this.editData = res.products;

              if (this.editData) {
                this.addEditProductForm.controls['mpn'].setValue(
                  this.editData?.mpn
                );
                this.addEditProductForm.controls['upc'].setValue(
                  this.editData?.upc
                );
                this.addEditProductForm.controls['amazon_asin'].setValue(
                  this.editData?.asin !== 'ASIN Pending' &&
                    this.editData?.asin !== 'Not Approved'
                    ? this.editData?.asin
                    : ''
                );
                this.addEditProductForm.controls['product_name'].setValue(
                  this.editData?.name
                );
                this.addEditProductForm.controls['brand'].setValue(
                  this.editData?.brand
                );
                this.addEditProductForm.controls['collection'].setValue(
                  this.editData?.collection
                );
                this.addEditProductForm.controls['product_category'].setValue(
                  this.editData?.category
                );
                this.addEditProductForm.controls['sales_tier'].setValue(
                  this.editData?.sales_tier
                );
                this.addEditProductForm.controls['unit_price'].setValue(
                  this.editData?.unit_price
                );
                this.addEditProductForm.controls['map'].setValue(
                  this.editData?.map
                );
                // this.addEditProductForm.controls['msrp'].setValue(
                //   this.editData?.msrp
                // );
                this.addEditProductForm.controls['handling_time'].setValue(
                  this.editData?.handling_time
                );
                this.addEditProductForm.controls['shipping_Method'].setValue(
                  this.editData?.shipping_method
                );
                this.addEditProductForm.controls['number_of_boxes'].setValue(
                  this.editData?.number_of_boxes
                );
                this.addEditProductForm.controls['product_status'].setValue(
                  this.editData?.product_status
                );
                this.addEditProductForm.controls['restricted_reason'].setValue(
                  this.editData?.restricted_reason
                );
                this.editData?.shipping_dimensions.map(
                  (res: {
                    weight: any;
                    length: number;
                    width: number;
                    height: number;
                    gross_weight: number;
                  }) => {
                    this.shippingDimensionsOfBoxes.push(
                      this.formBuilder.group({
                        length: [res?.length, [Validators.required]],
                        width: [res?.width, [Validators.required]],
                        height: [res?.height, [Validators.required]],
                        gross_weight: [res?.weight, [Validators.required]],
                      })
                    );
                  }
                );
              }
            } else {
              if (res.error_message === 'SKU param missing') {
                this.message.create('warning', res.error_message);
              } else {
                this.message.create('error', res.error_message);
              }
              this.addShippingDimensionsOfBoxes();
            }
          },
          (err) => {
            console.log('error', err);
          }
        );
      }
    } else {
      this.addShippingDimensionsOfBoxes();
    }

    // this.addEditProductForm.controls['number_of_boxes'].disable();
  }

  editProduct() {
    this.addEditProductForm.enable();
    this.disabledFiled = false;
  }

  searchValue(event: string, type: string) {
    this.setDropDownValue = event;
    if (event) {
      switch (type) {
        case 'Brand':
          this.searchList = this.listOfBrand.filter((res: string) => {
            return res.toLocaleLowerCase().includes(event.toLocaleLowerCase());
          });
          break;
        case 'Collection':
          this.searchList = this.listOfCollection.filter((res: string) => {
            return res.toLocaleLowerCase().includes(event.toLocaleLowerCase());
          });
          break;
        case 'Product Category':
          this.searchList = this.listOfProductCategory.filter((res: string) => {
            return res.toLocaleLowerCase().includes(event.toLocaleLowerCase());
          });
          break;
        default:
          break;
      }
    }
  }

  get shippingDimensionsOfBoxes(): FormArray {
    return this.addEditProductForm.controls[
      'shipping_dimensions_of_box'
    ] as FormArray;
  }
  // , Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')

  newShippingDimensionsOfBoxes(): FormGroup {
    return this.formBuilder.group({
      length: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required]],
      gross_weight: ['', [Validators.required]],
    });
  }

  addShippingDimensionsOfBoxes() {
    this.shippingDimensionsOfBoxes.push(this.newShippingDimensionsOfBoxes());
    this.addEditProductForm.controls['number_of_boxes'].setValue(
      this.shippingDimensionsOfBoxes.controls.length
    );
  }

  removeShippingDimensionsOfBoxes(i: number) {
    this.shippingDimensionsOfBoxes.removeAt(i);
    this.addEditProductForm.controls['number_of_boxes'].setValue(
      this.shippingDimensionsOfBoxes.controls.length
    );
  }

  addItem(type: string): void {
    if (this.setDropDownValue && this.searchList.length === 0) {
      switch (type) {
        case 'Brand':
          if (this.setDropDownValue.length > 80) {
            return;
          }
          if (this.listOfBrand.indexOf(this.setDropDownValue) === -1) {
            this.listOfBrand = [...this.listOfBrand, this.setDropDownValue];
          }
          break;
        case 'Collection':
          if (
            this.setDropDownValue.length < 3 ||
            this.setDropDownValue.length > 80
          ) {
            return;
          }
          if (this.listOfCollection.indexOf(this.setDropDownValue) === -1) {
            this.listOfCollection = [
              ...this.listOfCollection,
              this.setDropDownValue,
            ];
          }
          break;
        case 'Product Category':
          if (
            this.setDropDownValue.length < 3 ||
            this.setDropDownValue.length > 80
          ) {
            return;
          }
          if (
            this.listOfProductCategory.indexOf(this.setDropDownValue) === -1
          ) {
            this.listOfProductCategory = [
              ...this.listOfProductCategory,
              this.setDropDownValue,
            ];
          }
          break;
        default:
          break;
      }
    }
  }

  submitForm(): void {
    if (this.addEditProductForm.valid) {
      this.isLoading = true;
      let data: any = {
        mpn: this.addEditProductForm.value.mpn,
        upc: this.addEditProductForm.value.upc,
        asin: this.addEditProductForm.value.amazon_asin,
        name: this.addEditProductForm.value.product_name,
        brand: this.addEditProductForm.value.brand,
        collection: this.addEditProductForm.value.collection,
        product_category: this.addEditProductForm.value.product_category,
        sales_tier: this.addEditProductForm.value.sales_tier,
        unit_price: this.addEditProductForm.value.unit_price,
        map: this.addEditProductForm.value.map,
        // msrp: this.addEditProductForm.value.msrp,
        handling_time: this.addEditProductForm.value.handling_time,
        shipping_method: this.addEditProductForm.value.shipping_Method,
        product_status: this.addEditProductForm.value.product_status,
        number_of_boxes: this.addEditProductForm.value.number_of_boxes ?? 1,
        restricted_reason: this.addEditProductForm.value.restricted_reason,
      };
      let dimensions: any[] = [];
      this.shippingDimensionsOfBoxes.value.map((res: any, index: number) => {
        dimensions.push({
          box_no: index + 1,
          length: +res.length,
          width: +res.width,
          height: +res.height,
          weight: +res.gross_weight,
        });
      });
      data['shipping_dimensions'] = dimensions;

      if (this.editSection) {
        data['sku'] = this.sku;
        this.productService.editProduct(data).subscribe(
          (res: any) => {
            console.log(res);
            if (res.success) {
              this.resReferenceCode = res?.reference_code;
              this.message.create('success', 'Edit product successfully!');
              this.backButton();
            }
            this.isLoading = false;
          },
          (err) => (this.isLoading = false)
        );
      } else {
        this.productService.createProduct(data).subscribe(
          (res: any) => {
            console.log(res);
            if (res.success) {
              this.resReferenceCode = res?.reference_code;
              this.message.create('success', 'Add product successfully!');
              this.backButton();
            }
            this.isLoading = false;
          },
          (err) => (this.isLoading = false)
        );
      }
    } else {
      Object.values(this.addEditProductForm.controls).forEach((control) => {
        if (control.invalid) {
          if (control instanceof FormControl) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }

          if (control instanceof FormArray) {
            console.log(control);

            control.controls.forEach((formGroup: any) => {
              Object.values(formGroup.controls).forEach((arrayControl: any) => {
                if (arrayControl.invalid) {
                  arrayControl.markAsDirty();
                  arrayControl.updateValueAndValidity({ onlySelf: true });
                }
              });
            });
          }
        }
      });
    }
  }

  closeMultiProduct(event: string) {
    this.isImportVisible = false;
    if (event) {
      this.referenceCode = event;
      this.isVisible = true;
    }
  }

  backButton() {
    if (this.editSection) {
      this.router.navigateByUrl('/main/products', {
        state: { code: this.resReferenceCode },
      });
    } else {
      this.router.navigate([`/main/products`], {
        state: { code: this.resReferenceCode },
      });
    }
  }
}
