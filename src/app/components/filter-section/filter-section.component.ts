import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  @Output() closeNav = new EventEmitter();
  @Output() changeData = new EventEmitter();

  @Input() rangeDate: string = '';
  @Input() shipDate: string = '';
  @Input() shipOutLocation: string = '';
  @Input() mpn: string = '';
  @Input() carrier: string = '';
  @Input() committedShipDate: string = '';
  @Input() status: string = '';
  @Input() remarkStatus: string = '';
  @Input() invoiceStatus: string = '';

  @Input() tabName: string = '';
  accountSearch = new Subject<any>();
  appDateFormate = AppDateFormate;

  constructor() {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.changeValue(value.target.value ? value.target.value : '', 'mpn');
      });
  }
  ngOnInit(): void {}

  closeSideBar() {
    this.closeNav.emit();
  }

  changeValue(value: string, type: string) {
    this.changeData.emit({ value: value, type: type });
  }
}
