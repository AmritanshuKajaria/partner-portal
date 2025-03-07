import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-section',
  templateUrl: './orders-section.component.html',
  styleUrls: ['./orders-section.component.scss'],
})
export class OrdersSectionComponent implements OnInit {
  selectedTab: number = 0;
  newTotal: number = -1;
  pendingShipmentTotal: number = -1;
  cancellationRequestedTotal: number = -1;
  pendingInvoiceTotal: number = -1;
  returnToSenderTotal: number = -1;
  inTransitTotal: number = -1;
  deliveredTotal: number = -1;
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
      case 'new':
        this.newTotal = total;
        break;
      case 'pending-shipment':
        this.pendingShipmentTotal = total;
        break;
      case 'cancellation-requested':
        this.cancellationRequestedTotal = total;
        break;
      case 'pending-invoice':
        this.pendingInvoiceTotal = total;
        break;
      case 'returnToSender':
        this.returnToSenderTotal = total;
        break;
      // case 'in-transit':
      //   this.inTransitTotal = total;
      //   break;
      // case 'delivered':
      //   this.deliveredTotal = total;
      //   break;
      case 'all':
        this.allTotal = total;
        break;
    }
  }

  changeTabIndex(event: number) {
    this.selectedTab = event;
  }
}
