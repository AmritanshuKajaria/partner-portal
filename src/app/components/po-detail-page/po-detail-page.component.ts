import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-po-detail-page',
  templateUrl: './po-detail-page.component.html',
  styleUrls: ['./po-detail-page.component.scss'],
})
export class PoDetailPageComponent implements OnInit {
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  poDetailData: any = '';
  isLoading: boolean = false;
  poNotExist: boolean = true;

  orderStatus = {
    status: 'Pending Shipment',
    action: 'Cancel Order',
    actions: 'Mark as shipped',
  };
  poDescriptionData = [
    {
      id: 1,
      productDescription: {
        mpn: '24603',
        description: 'Absolute Feeder Blue',
        upc: '047977005614',
        brand: 'Woodlink',
        asin: 'B0057QN478',
        totalNoOfBox: '1',
        unit: '1-Box #1',
        shippingDims: '14" x 16" x 11", 10lbs',
        trackingNo: '1ZRR11990397673743',
      },
      qty: '1',
      unitPrice: '64.06',
      unitAllowances: '0.00',
      unitExtendedPrice: '64.06',
      extendedTotal: '64.06',
    },
  ];
  poNo: string = '';
  poClarification: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
    this.route.params.subscribe((params) => {
      this.poNo = params['poNo'];
    });
    this.isLoading = true;
    ordersService.getSingleOrder(this.poNo).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.poDetailData = res?.order;
        } else {
          this.poNotExist = res.success;
        }
      },
      error: (err) => (this.isLoading = false),
    });
  }
  ngOnInit(): void {}

  createArray(obj: any) {
    console.log(Object.keys(obj));

    return Object.keys(obj);
  }

  downloadAction(type: string) {
    switch (type) {
      case 'Download PO':
        this.ordersService.downloadPo(this.poNo).subscribe((res: any) => {
          if (res.success) {
            this.message.success('Download po successfully!');
            window.open(res.label);
          }
        });
        break;
      case 'Download Shipping Labels':
        this.ordersService.downloadLabel(this.poNo).subscribe((res: any) => {
          if (res.success) {
            this.message.success('Download label successfully!');
            window.open(res.label);
          }
        });
        break;
      case 'PO Clarification':
        this.poClarification = true;
        break;
    }
  }
}
