import { Component, Input, OnInit } from '@angular/core';

export enum StatusEnum {
  Success,
  Pending,
  Hold,
  Stopped,
  Failure,
}

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent implements OnInit {
  @Input() type: StatusEnum = StatusEnum.Pending;
  @Input() text: string | undefined = '';
  bgColor: string = '#3abe25';

  constructor() {}

  ngOnInit(): void {
    switch (this.type) {
      case 0:
        this.bgColor = '#3abe25';
        break;
      case 1:
        this.bgColor = '#1890ff';
        break;
      case 2:
        this.bgColor = '#ec7211';
        break;
      case 3:
        this.bgColor = 'orange';
        break;
      default:
        this.bgColor = 'red';
        break;
    }
  }
}
