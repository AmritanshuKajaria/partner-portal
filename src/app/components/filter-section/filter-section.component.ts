import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  @Output() closeNav = new EventEmitter();
  @Output() changeData = new EventEmitter();

  @Input() rangeDate: string = '';
  @Input() shipOutLocation: string = '';
  @Input() sku: string = '';
  @Input() carrier: string = '';
  @Input() committedShipDate: string = '';
  @Input() status: string = '';

  @Input() tabName: string = '';
  accountSearch = new Subject<any>();

  constructor() {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.changeValue(value.target.value ? value.target.value : '', 'sku');
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
