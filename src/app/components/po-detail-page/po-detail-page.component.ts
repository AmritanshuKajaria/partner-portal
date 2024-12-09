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
    let res = {
      success: true,
      processed_at: '2024-12-05T06:10:57.000Z',
      requested_po_no: 'RAZ-8052',
      order: {
        order_summary: {
          po_no: 'RAZ-8052',
          ship_by_date: 'IMMEDIATE',
          shipping_carrier: 'CHR-FEDEX',
          shipping_service: 'GROUND',
          shipping_terms: 'Collect',
          po_date: '2024-12-03',
          committed_ship_date: '2024-12-06',
          cancel_after_date: '2024-12-13',
        },
        order_status: {
          status: 'Shipment Pending',
          status_remark: 'Late',
        },
        ship_from: {
          address_line1: '3996 S Riverside Avenue',
          address_line2: '',
          city: 'Colton',
          state_code: 'CA',
          postal_code: '92324',
          country_code: 'US',
          location_code: 'CA-92324',
        },
        ship_to: {
          name: 'Joshua Benham ',
          company_name: '',
          address_line1: '50 BLACK BEAR LN',
          address_line2: '',
          city: 'PALM COAST',
          state_code: 'FL',
          postal_code: '32137-7355',
          country_code: 'US',
          phone: '646-760-8776',
        },
        order_item: [
          {
            mpn: '15130894',
            product_name: 'Pocket Mod Petite - Blue (ISTA)',
            upc: '845423023263',
            brand: 'Razor',
            asin: 'B085ZDDY11',
            number_of_boxes: 1,
            quantity: 2,
            shipping_dimensions: {
              '1': {
                '1': {
                  dims: {
                    box_no: '1',
                    length: '37.75',
                    width: '10.38',
                    height: '20.75',
                    weight: '35.00',
                  },
                },
                '2': {
                  dims: {
                    box_no: '2',
                    length: '54.75',
                    width: '32.38',
                    height: '15.75',
                    weight: '12.00',
                  },
                },
              },
              '2': {
                '1': {
                  dims: {
                    box_no: '1',
                    length: '52.75',
                    width: '63.38',
                    height: '25.75',
                    weight: '65.00',
                  },
                },
                '2': {
                  dims: {
                    box_no: '5',
                    length: '35.75',
                    width: '65.38',
                    height: '65.75',
                    weight: '95.00',
                  },
                },
              },
            },
            unit_price: '233.93',
            unit_extended_price: '25.65',
            unit_extended_total: '50.20',
            po_total: '85.60',
            allowances: {
              onInvoicePromotion: '1.00',
              onInvoiceCoOp: '2.00',
              daOnInvoice: '5.00',
            },
          },
        ],
      },
    };
    if (res.success) {
      this.poDetailData = res?.order;

      console.log(res, 'res from objd');
    } else {
      this.poNotExist = res.success;
    }
    this.isLoading = true;
    ordersService.getSingleOrder(this.poNo).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.poDetailData = res?.order;

          res.order.order_item.map((item: any) => {
            item.shipping_dimensions = Object.keys(
              item.shipping_dimensions
            ).map((key1) => {
              return Object.keys(item.shipping_dimensions[key1]).map((key2) => {
                return item.shipping_dimensions[key1][key2].dims;
              });
            });
          });
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
