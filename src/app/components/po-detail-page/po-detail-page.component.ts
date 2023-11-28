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
      processed_at: '2023-07-05T12:12:16.000Z',
      requested_po_no: 'AVO-2690',
      order: {
        order_summary: {
          po_no: 'AVO-2690',
          ship_by_date: 'IMMEDIATE',
          shipping_carrier: 'UPS',
          shipping_service: 'GROUND',
          shipping_terms: 'Collect',
          po_date: '2023-07-04T23:20:00.000Z',
          committed_ship_date: '2023-07-06',
          cancel_after_date: '2023-07-13',
        },
        order_status: {
          po_status: 'Pending Shipment',
          satus_remark: 'Late',
        },
        ship_from: {
          company_name: 'Panacea Product Corporation (ANT)',
          address_line1: '90 McMillen RD Antioch',
          address_line2: '',
          city: 'Antioch',
          state_code: 'IL',
          postal_code: '60002',
          country_code: 'US',
          location_code: 'WDK-LOC-001',
        },
        ship_to: {
          name: 'Renee Stipa',
          company_name: '',
          address_line1: '129 SPRING OAK DR',
          address_line2: '',
          city: 'Malvern',
          state_code: 'PA',
          postal_code: '19355',
          country_code: 'US',
          phone: '646-760-8776',
        },
        order_item: [
          {
            mpn: '24603',
            product_name: 'Absolute Feeder Blue',
            upc: '047977005614',
            brand: 'Woodlink',
            asin: 'B0057QN478',
            number_of_boxes: 4,
            qty: 2,
            shipping_dimensions: [
              {
                '1': {
                  '1': {
                    box_no: 1,
                    length: 4,
                    width: 4,
                    height: 6,
                    weight: 12,
                    tracking: '1ZRR98990392758858',
                  },
                  '2': {
                    box_no: 2,
                    length: 1,
                    width: 2,
                    height: 5,
                    weight: 10,
                    tracking: '1ZRR18990392758859',
                  },
                },
                '2': {
                  '1': {
                    box_no: 1,
                    length: 4,
                    width: 4,
                    height: 6,
                    weight: 12,
                    tracking: '1ZRR11990392758890',
                  },
                  '2': {
                    box_no: 2,
                    length: 1,
                    width: 2,
                    height: 5,
                    weight: 10,
                    tracking: '1ZRR11990392758859',
                  },
                },
              },
            ],
            unit_price: 13,
            allowances: {
              co_op_allowance: 2.5,
              promotional_allowance: 2.5,
            },
            unit_extended_price: 8,
            unit_extended_total: 16,
            defective_allowance: 2,
            po_total: 14,
          },
        ],
      },
    };
    if (res.success) {
      this.poDetailData = res?.order;
    } else {
      this.poNotExist = res.success;
    }
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
