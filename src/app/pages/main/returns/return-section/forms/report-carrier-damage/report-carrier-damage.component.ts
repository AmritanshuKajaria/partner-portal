import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

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
      console.log(this.uploadedImages);

      this.close();
    }
  }

  onImageSrcChange(event: any, index: number) {
    this.uploadedImages[index] = event;
    this.showErrors[index] = false;
  }
}
