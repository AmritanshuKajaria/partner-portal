import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { SingleReturn } from 'src/app/shared/model/returns.model';

@Component({
  selector: 'app-return-table',
  templateUrl: './return-table.component.html',
  styleUrls: ['./return-table.component.scss'],
})
export class ReturnTableComponent implements OnInit {
  // @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Input() total: number = 1;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: SingleReturn[] = [];
  @Input() tabName: string = '';
  @Input() badgeTotal: number = 0;

  @Output() pageChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();

  accountSearch = new Subject<any>();

  statusEnum: typeof StatusEnum = StatusEnum;
  addRaForm!: FormGroup;
  searchForm!: FormGroup;
  addRaVisible: boolean = false;
  isExportVisible: boolean = false;
  approveCreditModelVisible: boolean = false;
  listOfFilter: any = '';

  pageSizeOptions = [100];

  constructor() {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.searchChange.emit(value.target.value);
      });

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // initialize addra form
    this.addRaForm = new FormGroup({
      raInput: new FormControl(''),
    });
  }

  selectAction(data: string) {
    if (data === 'Return Received') {
      this.approveCreditModelVisible = true;
    } else if (data === 'Return Initiated') {
      this.addRaVisible = true;
    }
  }

  openNav() {
    // this.sidenavSection.nativeElement.style.width = '300px';
  }

  closeNav() {
    // this.sidenavSection.nativeElement.style.width = '0';
  }

  // for addRa
  submitAddRaForm() {}

  // for approve credit form submit
  approveCreditSubmitForm() {}

  onPageIndexChange(page: number): void {
    this.pageChange.emit(page);
  }

  handleCancel() {
    this.isExportVisible = false;
  }
}
