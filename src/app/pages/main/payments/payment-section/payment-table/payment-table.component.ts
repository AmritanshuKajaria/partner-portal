import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss'],
})
export class PaymentTableComponent implements OnInit {
  @Input() total: number = 1;
  @Input() pageSize: number = 50;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: any[] = [];
  @Input() tabName: string = '';

  @Output() changeModel = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter<number>();

  statusEnum: typeof StatusEnum = StatusEnum;

  pageSizeOptions = [100];

  constructor() {}
  ngOnInit(): void {}

  selectAction(data: string) {
    this.changeModel.emit(data);
  }

  onPageIndexChange(page: number): void {
    this.pageIndexChange.emit(page);
  }
}
