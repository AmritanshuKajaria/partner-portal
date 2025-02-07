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
  showFileSizeError = false;
  maxUploadFileSize = 10;

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
    if (event?.target?.files[0].size / 1e6 > this.maxUploadFileSize) {
      this.showFileSizeError = true;
      this.uploadForm.get('name')?.reset();
      return;
    }
    this.showFileSizeError = false;
    this.selectFile = event?.target?.files[0];
  }

  submit() {
    if (this.uploadForm.valid) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append('uploaded_file', this.selectFile);
      this.inventoryService.inventoryFeedUpload(formData).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.success) {
            this.message.create('success', 'Inventory upload successfully!');
            this.handleCancel(res?.feed_code);
          } else {
            this.message.error(
              res?.error_message
                ? res?.error_message
                : 'Inventory upload failed!'
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Inventory upload failed!');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.message.create('warning', 'Please upload your file.');
    }
  }

  handleCancel(feed_code: string) {
    this.closeModel.emit(feed_code);
  }
}
