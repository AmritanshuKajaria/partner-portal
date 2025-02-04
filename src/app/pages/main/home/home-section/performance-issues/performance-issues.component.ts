import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-performance-issues',
  templateUrl: './performance-issues.component.html',
})
export class PerformanceIssuesComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.dashboardService.getAllIssues();
  }
}
