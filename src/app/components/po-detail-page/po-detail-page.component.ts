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
  poDescriptionData = [];
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
    return Object.keys(obj);
  }

  downloadAction(type: string) {
    switch (type) {
      case 'Download PO':
        this.ordersService.downloadPo(this.poNo).subscribe((res: any) => {
          if (res.success) {
            let a = document.createElement('a');
            a.href = 'https://' + res.po_copy_url;
            a.click();
            this.message.success('Download po successfully!');
          }
        });
        break;
      case 'Download Shipping Labels':
        this.ordersService.downloadLabel(this.poNo).subscribe((res: any) => {
          if (res.success) {
            let link = document.createElement('a');
            link.href = 'https://' + res.label;
            link.click();
            this.message.success('Download label successfully!');
          }
        });
        break;
      case 'PO Clarification':
        this.poClarification = true;
        break;
    }
  }
}
