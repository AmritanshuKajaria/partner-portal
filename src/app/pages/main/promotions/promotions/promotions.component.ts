import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  isVisible: boolean = false;

  listOfOption = ['Only Price', 'Only MAP', 'Price & MAP'];
  specificSku: boolean = false;
  allSku: boolean = false;
  isLoading: boolean = false;

  showRefCodeModal = false;
  referenceCode = '';

  constructor() {}
  ngOnInit(): void {}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  date = null;

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
  selectPrepaidLabel(event: string) {
    if (event === 'yes') {
      this.specificSku = false;
      this.allSku = true;
    }
    if (event === 'no') {
      this.specificSku = true;
      this.allSku = false;
    }
  }

  handleAddPromotionsClose(referenceCode: any) {
    if (referenceCode) {
      this.referenceCode = referenceCode;
      this.showRefCodeModal = true;
    }
    this.isVisible = false;
  }
}
