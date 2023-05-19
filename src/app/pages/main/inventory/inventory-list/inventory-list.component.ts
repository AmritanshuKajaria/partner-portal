import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];

  isUploadVisible: boolean = false;

  inventoryList = [
    {
      id: 1,
      feedCode: 'ASL-FEED-PROCESS-001',
      time: '2:30',
      method: 'Email',
      inStock: true,
      outOfStock: false,
    },
    {
      id: 2,
      feedCode: 'ASL-FEED-PROCESS-002',
      time: '3:30',
      method: 'EDI',
      inStock: false,
      outOfStock: true,
    },
    {
      id: 3,
      feedCode: 'ASL-FEED-PROCESS-003',
      time: '4:20',
      method: 'EDI',
      inStock: false,
      outOfStock: true,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigatePage(path: string) {
    this.router.navigate([`/main/${path}`]);
  }

  openModal() {
    this.isUploadVisible = true;
  }

  handleCancel() {
    this.isUploadVisible = false;
  }
}