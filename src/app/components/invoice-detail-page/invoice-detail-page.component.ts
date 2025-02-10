import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Invoice, InvoiceDetails } from 'src/app/shared/model/payments.model';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-invoice-detail-page',
  templateUrl: './invoice-detail-page.component.html',
  styleUrls: ['./invoice-detail-page.component.scss'],
})
export class InvoiceDetailPageComponent implements OnInit {
  invoiceDetailData: Invoice = {};
  invoiceDetails: InvoiceDetails = {};

  invoiceTypeLabelMapping: any = {
    3: 'Non-Compliant Invoice',
    2: 'Quantity and Price Error',
    4: 'Quantity and Price Error',
  };

  isLoading: boolean = false;
  invoiceNo: string = '';
  invoiceNotExist: boolean = true;

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
      next: (res: InvoiceDetails) => {
        this.isLoading = false;
        if (res.success) {
          this.invoiceDetails = res;
          this.invoiceDetailData = res?.invoice ?? {};
        } else {
          this.message.error(
            res?.error_message
              ? res?.error_message
              : 'Get Invoice Details Failed!'
          );
          this.invoiceNotExist = res?.success ?? false;
        }
      },
      error: (err) => {
        this.message.error('Get Invoice Details Failed!');
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {}
}
