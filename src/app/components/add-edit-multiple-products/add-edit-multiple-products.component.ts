import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  DownloadTemplates,
  ProductService,
} from 'src/app/shared/service/product.service';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-add-edit-multiple-products',
  templateUrl: './add-edit-multiple-products.component.html',
  styleUrls: ['./add-edit-multiple-products.component.scss'],
})
export class AddEditMultipleProductsComponent implements OnInit {
  @Output() closeModel = new EventEmitter();
  @Input() templateType: string = '';
  selectType: string = '';
  isUploadVisible: boolean = false;
  chooseType = [
    {
      label: 'Edit Unit Price',
      value: 'EDIT_PRICE',
    },
    {
      label: 'Edit Shipping Dimensions',
      value: 'EDIT_SHIPPING_DIMENSIONS',
    },
    {
      label: 'Edit Product Details',
      value: 'EDIT_PRODUCT_DETAILS',
    },
    {
      label: 'Change Product Status',
      value: 'CHANGE_PRODUCT_STATUS',
    },
    {
      label: 'Edit MPN',
      value: 'EDIT_MPN',
    },
    {
      label: 'Add/Edit ASIN',
      value: 'ADD_EDIT_ASIN',
    },
    {
      label: 'Add/Edit UPC',
      value: 'ADD_EDIT_UPC',
    },
    {
      label: 'Remove ASIN',
      value: 'REMOVE_ASIN',
    },
    {
      label: 'Remove UPC',
      value: 'REMOVE_UPC',
    },
    // 'ADD_PRODUCT',
  ];
  name = new FormControl('');
  userPermissions: any = '';
  actionType: string = '';
  multiProduct!: FormGroup;
  selectFile: any = '';
  isLoading: boolean = false;
  referenceCode: any = '';

  constructor(
    private userPermissionService: UserPermissionService,
    private message: NzMessageService,
    private productService: ProductService
  ) {
    userPermissionService.userPermission.subscribe((permission: any) => {
      this.userPermissions = permission;
      if (this.userPermissions.partner_map) {
        this.chooseType.splice(1, 0, {
          label: 'Add/Edit MAP',
          value: 'ADD_EDIT_MAP',
        });
        if (this.userPermissions.partner_sku_level_handling) {
          this.chooseType.splice(2, 0, {
            label: 'SKU specific Handling Time',
            value: 'EDIT_SKU_SPECIFIC_HANDLING_TIME',
          });
        }
      } else {
        this.chooseType.splice(1, 0, {
          label: 'SKU specific Handling Time',
          value: 'EDIT_SKU_SPECIFIC_HANDLING_TIME',
        });
      }
    });
  }
  ngOnInit(): void {
    if (this.templateType) {
      this.selectType = this.templateType;
    }
    this.multiProduct = new FormGroup({
      selectType: new FormControl(this.templateType),
      downloadTemplate: new FormControl(''),
      uploadFile: new FormControl('', [Validators.required]),
    });
    if (this.actionType === 'Edit') {
      this.multiProduct.controls['selectType'].setValidators([
        Validators.required,
      ]);
    }
  }

  setFileName(path: string) {
    const fileName = path.replace(/\//g, ' ').substring(1).split('\\')[2];
    return fileName;
  }

  selectFiles(event: any) {
    this.selectFile = event?.target?.files[0];
  }

  selectDownloadTemplate(event: boolean) {
    if (this.multiProduct.controls['selectType'].value) {
      const data: DownloadTemplates = {
        template_type: this.multiProduct.controls['selectType'].value,
        include_data: event,
      };
      this.productService.downloadTemplates(data).subscribe((res: any) => {
        if (res.success) {
          this.message.create('success', 'Template Downloaded Successfully!');
          var objectUrl = res.template_url;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        }
      });
    } else {
      if (this.multiProduct.controls['downloadTemplate'].value) {
        this.message.create('warning', 'Please select edit type first!');
        setTimeout(() => {
          this.multiProduct.controls['downloadTemplate'].setValue('');
        }, 100);
      }
    }
  }

  submit() {
    this.isLoading = true;
    const data = new FormData();
    data.append(
      'template_type',
      this.multiProduct.controls['selectType'].value
        ? this.multiProduct.controls['selectType'].value
        : 'ADD_PRODUCT'
    );
    data.append('uploaded_file_url', this.selectFile);

    this.productService.productAddEditUpload(data).subscribe(
      (result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.referenceCode = result?.reference_code;

          // this.message.create(
          //   'success',
          //   `${this.actionType} multiple product successfully!`
          // );
          this.handleCancel();
        }
      },
      (err) => (this.isLoading = false)
    );
  }

  handleCancel() {
    this.closeModel.emit(this.referenceCode);
  }
}
