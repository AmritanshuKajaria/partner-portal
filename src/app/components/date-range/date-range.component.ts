import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { endOfMonth } from 'date-fns';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit {
  @Output() modelChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();
  @Output() export = new EventEmitter();
  @Input() badgeTotal: number = 0;
  ranges = {
    Today: [new Date(), new Date()],
    YesterDay: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
    'Last 7 Days': [
      new Date(new Date().setDate(new Date().getDate() - 6)),
      new Date(new Date()),
    ],
    'Last 30 Days': [
      new Date(new Date().setDate(new Date().getDate() - 29)),
      new Date(new Date()),
    ],
    'This Month': [new Date(), endOfMonth(new Date())],
    'Last Month': [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      new Date(),
    ],
    // Custom: [],
  };
  searchForm!: FormGroup;
  search_term: string = '';

  constructor() {}
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  searchSubmit() {
    const searchValue = this.searchForm.get('search')?.value;
    if (this.search_term !== searchValue) {
      this.search_term = searchValue;
      this.searchChange.emit(this.search_term);
    }
  }

  exportData() {
    this.export.emit();
  }

  onChange(event: Date[]) {
    this.modelChange.emit(event);
  }
  onFilterChange() {
    this.filterChange.emit();
  }
}
