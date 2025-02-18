import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ProcessedInventory,
  RejectInventory,
} from 'src/app/shared/model/inventory.model';
import {
  InventoryFeed,
  InventoryService,
} from 'src/app/shared/service/inventory.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss'],
})
export class ViewInventoryComponent implements OnInit {
  editData: any = {};

  feedCode: string = '';
  isLoading: boolean = true;
  total: number = 0;
  feedResult: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.feedCode = this.activatedRoute.snapshot.paramMap.get('feedCode') ?? '';
    this.feedResult =
      this.activatedRoute.snapshot.paramMap.get('feedResult') ?? '';
    const data: InventoryFeed = {
      feed_code: this.feedCode,
    };
    if (this.feedResult.toLocaleLowerCase() === 'processed') {
      this.inventoryService.inventoryFeed(data).subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            const res: ProcessedInventory = result?.response ?? {};
            this.editData = res;
            this.total =
              (this.editData?.active_in_stock
                ? this.editData?.active_in_stock
                : 0) +
              (this.editData?.active_out_of_stock
                ? this.editData?.active_out_of_stock
                : 0) +
              (this.editData?.suppressed_in_stock
                ? this.editData?.suppressed_in_stock
                : 0) +
              (this.editData?.suppressed_out_of_stock
                ? this.editData?.suppressed_out_of_stock
                : 0) +
              (this.editData?.discontinued_in_stock
                ? this.editData?.discontinued_in_stock
                : 0) +
              (this.editData?.discontinued_out_of_stock
                ? this.editData?.discontinued_out_of_stock
                : 0) +
              (this.editData?.partner_restricted_in_stock
                ? this.editData?.partner_restricted_in_stock
                : 0) +
              (this.editData?.partner_restricted_out_of_stock
                ? this.editData?.partner_restricted_out_of_stock
                : 0) +
              (this.editData?.ltl_in_stock ? this.editData?.ltl_in_stock : 0) +
              (this.editData?.ltl_out_of_stock
                ? this.editData?.ltl_out_of_stock
                : 0) +
              (this.editData?.stranded_in_feed_in_stock
                ? this.editData?.stranded_in_feed_in_stock
                : 0) +
              (this.editData?.stranded_in_feed_out_of_stock
                ? this.editData?.stranded_in_feed_out_of_stock
                : 0);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Inventory Process Failed'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Inventory Process Failed');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.inventoryService.inventoryFeedReject(data).subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            const res: RejectInventory = result?.response ?? {};
            this.editData = res;
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Reject Inventory Feed Failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Reject Inventory Feed Failed!');
          }
          this.isLoading = false;
        },
      });
    }
  }

  backButton(path: string) {
    this.router.navigate([`/main/${path}`]);
  }
}
