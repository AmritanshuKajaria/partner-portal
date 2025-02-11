import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-home-filter-action',
  templateUrl: './home-filter-action.component.html',
  styleUrls: ['./home-filter-action.component.scss'],
})
export class HomeFilterActionComponent implements OnInit {
  @Input() badgeTotal: number = 0;
  @Input() totalRecord: number = 0;
  @Input() issueName: string = '';
  @Input() code: string = '';
  @Output() showFilter = new EventEmitter();
  @Output() search = new EventEmitter();

  searchValue: string = '';
  exportType: boolean = false;
  isDownloadVisible: boolean = false;
  isFiltersVisible: boolean = true;
  search_term: string = '';
  searchForm!: FormGroup;

  constructor() {}
  ngOnInit(): void {
    this.isFiltersVisible =
      this.issueName !== '1' &&
      this.issueName !== '2' &&
      this.issueName !== '3' &&
      this.issueName !== '13' &&
      this.issueName !== '14' &&
      this.issueName !== '15' &&
      this.issueName !== '9' &&
      this.issueName !== '11' &&
      this.issueName !== '12';
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  openFilterSection() {
    this.showFilter.emit();
  }

  searchSubmit() {
    const searchValue = this.searchForm.get('search')?.value;
    if (this.search_term !== searchValue) {
      this.search_term = searchValue;
      this.search.emit(this.search_term);
    }
  }
}
