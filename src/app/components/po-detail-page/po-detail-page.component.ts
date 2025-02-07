import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrdersService } from 'src/app/shared/service/orders.service';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

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
  poDetailData: any;
  isLoading: boolean = false;
  poNotExist: boolean = true;

  orderStatus = {
    status: 'Pending Shipment',
    action: 'Cancel Order',
    actions: 'Mark as shipped',
  };
  poNo: string = '';
  poClarification: boolean = false;
  showDownloadLabel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private message: NzMessageService,
    private userPermissionService: UserPermissionService
  ) {
    this.route.params.subscribe((params) => {
      this.poNo = params['poNo'];
    });
    this.isLoading = true;
    ordersService.getSingleOrder(this.poNo).subscribe({
      next: (res: any) => {
        if (res.success) {
          res.order.order_item.map((item: any) => {
            item.shipping_dimensions = Object.keys(
              item.shipping_dimensions
            ).map((key1) => {
              return Object.keys(item.shipping_dimensions[key1]).map((key2) => {
                return item.shipping_dimensions[key1][key2].dims;
              });
            });
          });
          this.poDetailData = res?.order;
        } else {
          this.poNotExist = res.success;
        }
        this.isLoading = false;
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get order details failed!');
        }
        this.isLoading = false;
      },
    });

    this.userPermissionService.userPermission.subscribe((permission: any) => {
      if (permission?.label_enabled && permission.label_enabled !== 0) {
        this.showDownloadLabel = true;
      }
    });
  }
  ngOnInit(): void {}

  downloadAction(type: string) {
    switch (type) {
      case 'Download PO':
        this.ordersService.downloadPo(this.poNo).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Download po successfully!');
              window.open(res?.po_copy_url);
            } else {
              this.message.error(
                res.error_message ? res?.error_message : 'Download po failed!'
              );
            }
          },
          error: (e) => {
            if (!e?.error_shown) {
              this.message.error('Download po failed!');
            }
          },
        });
        break;
      case 'Download Shipping Labels':
        this.ordersService.downloadLabel(this.poNo).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Download label successfully!');
              window.open(`https://${res?.label_url}`);
            } else {
              this.message.error(
                res.error_message
                  ? res?.error_message
                  : 'Download label failed!'
              );
            }
          },
          error: (e) => {
            if (!e?.error_shown) {
              this.message.error('Download label failed!');
            }
          },
        });
        break;
      case 'PO Clarification':
        this.poClarification = true;
        break;
    }
  }
}
