import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-section',
  templateUrl: './return-section.component.html',
  styleUrls: ['./return-section.component.scss'],
})
export class ReturnSectionComponent implements OnInit {
  selectedTab: number = 0;
  returnInitiatedTotal: number = -1;
  returnShippedTotal: number = -1;
  returnDeliveredTotal: number = -1;
  carrierClaimsTotal: number = -1;
  inProgressTotal: number = -1;
  needActionTotal: number = -1;
  allTotal: number = -1;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation
      ? (navigation.extras.state as { index: number })
      : '';
    this.selectedTab = state ? state.index : 0;
  }

  ngOnInit(): void {}

  getTotal(total: number, type: string) {
    switch (type) {
      case 'returnInitiated':
        this.returnInitiatedTotal = total;
        break;
      case 'returnShipped':
        this.returnShippedTotal = total;
        break;
      case 'returnDelivered':
        this.returnDeliveredTotal = total;
        break;
      case 'inProgress':
        this.inProgressTotal = total;
        break;
      case 'needAction':
        this.needActionTotal = total;
        break;
      case 'all':
        this.allTotal = total;
        break;
    }
  }

  changeTabIndex(event: number) {
    this.selectedTab = event;
  }
}
