import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InventoryService } from 'src/app/shared/service/inventory.service';

@Component({
  selector: 'app-upload-model',
  templateUrl: './upload-model.component.html',
  styleUrls: ['./upload-model.component.scss'],
})
export class UploadModelComponent implements OnInit {
  @Output() closeModel = new EventEmitter();
  @Input() sectionType: string = '';
  name = new FormControl('');
  isLoading: boolean = false;
  selectFile: any = '';
  uploadForm!: FormGroup;

  constructor(
    private inventoryService: InventoryService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  setFileName(path: string) {
    const fileName = path.replace(/\//g, ' ').substring(1).split('\\')[2];
    return fileName;
  }

  selectFiles(event: any) {
    this.selectFile = event?.target?.files[0];
  }

  submit() {
    if (this.uploadForm.valid) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append('uploaded_file', this.selectFile);
      this.inventoryService.inventoryFeedUpload(formData).subscribe(
        (res: any) => {
          console.log(res);
          if (res.success) {
            this.message.create('success', 'Inventory upload successfully!');
          }
          this.handleCancel();
          this.isLoading = false;
        },
        (err) => {
          this.handleCancel();
          this.isLoading = false;
        }
      );
    } else {
      this.message.create('warning', 'Please upload your file.');
    }
  }

  handleCancel() {
    this.closeModel.emit();
  }
}
