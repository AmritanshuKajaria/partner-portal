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
  invoiceDetailData: any = {};

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
          this.invoiceDetailData = res?.invoice ?? {};
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
