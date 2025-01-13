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
  invoiceDetailData: any;
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
  ngOnInit(): void {}
}
