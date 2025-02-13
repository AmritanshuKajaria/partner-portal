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
  @Input() type: StatusEnum | string = StatusEnum.Pending;
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
      case 'Return Initiated':
        this.bgColor = '#ffcc00';
        break;
      case 'Return Shipped':
        this.bgColor = '#ff9900';
        break;
      case 'Return Delivered':
        this.bgColor = '#66ccff';
        break;
      case 'Claim Approval Pending':
        this.bgColor = '#ff6600';
        break;
      case 'Claim Approved':
        this.bgColor = '#00cc66';
        break;
      case 'Claim Rejected':
        this.bgColor = '#3abe25';
        break;
      case 'Completed':
        this.bgColor = 'brown';
        break;
      default:
        this.bgColor = 'red';
        break;
    }
  }
}
