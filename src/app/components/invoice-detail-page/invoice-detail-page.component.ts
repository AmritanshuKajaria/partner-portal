import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-invoice-detail-page',
  templateUrl: './invoice-detail-page.component.html',
  styleUrls: ['./invoice-detail-page.component.scss'],
})
export class InvoiceDetailPageComponent implements OnInit {
  invoiceDetailData: any = {
    invoice_summary: {
      invoice_no: 'SD_SD_DF',
      po_no: 'TAC-38943',
      invoice_date: '2024-08-07',
      payment_terms: 'Net 1',
    },
    invoice_status: {
      status: '1',
      due_date: '2024-08-07',
    },
    sold_to: {
      address_line1: '100 Ireland Dr',
      address_line2: '',
      city: 'Sparks',
      state_code: 'NV',
      postal_code: '89437',
      country_code: 'US',
      location_code: 'NV-89434-6531',
    },
    ship_to: {
      name: 'Payal H Thakkar ',
      company_name: '',
      address_line1: '8 DAFFAN CT',
      address_line2: '',
      city: 'FREDERICKSBURG',
      state_code: 'VA',
      postal_code: '22405-2158',
      country_code: 'US',
      phone: '646-760-8776',
    },
    invoice_detail: {
      mpn: 'SV5WS',
      description: 'invoice Description',
      product_name: 'Tachikara SV5WS Sensi-Tec Composite Volleyball',
      qty: '2',
      unit_price: '25.49',
      total: '200.20',
      net_product_cost: '54.23',
      shipping_cost: '54.23',
    },
    po_detail: {
      mpn: 'SV5WS',
      net_product_cost: '54.23',
      shipping_cost: '54.23',
      total: '200.20',
      qty: '5',
    },
  };

  invoiceStatusLabelMapping: any = {
    '1': 'Paid',
    '2': 'Processed',
    '3': 'Processed (Non-Compliant Invoice Format)',
    '4': 'Processed (Quantity and Price Error)',
  };

  isLoading: boolean = false;
  invoiceNo: string = '';
  invoiceNotExist: boolean = true;

  selectedOption: string = '1';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private message: NzMessageService
  ) {
    this.route.params.subscribe((params) => {
      this.invoiceNo = params['invoiceNo'];
    });
    this.isLoading = true;

    this.paymentService.getSinglePayment(this.invoiceNo).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res, 'singlePayment');
        } else {
          this.invoiceNotExist = res.success;
        }
        this.isLoading = false;
      },
      error: (err) => (this.isLoading = false),
    });
  }
  ngOnInit(): void {
    if (this.invoiceNo) {
      const parts = this.invoiceNo.split('_');
      const option = parts[parts.length - 1];
      this.selectedOption = ['1', '2', '3', '4'].includes(option)
        ? option
        : '1';
    }
  }

  getProcessedStatusLabel(option: string): string {
    return this.invoiceStatusLabelMapping[option]
      ?.replace('Processed ', '')
      ?.replace(/[()]/g, '');
  }
}
