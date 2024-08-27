import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Filters {
  filter_start_date?: string;
  filter_end_date?: string;
  filter_inventory_method?: string;
  filter_inventory_result?: string;
}
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigate([`/main/setting/${path}`]);
  }
}
