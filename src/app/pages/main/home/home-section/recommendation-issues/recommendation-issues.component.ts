import { Component, OnInit } from '@angular/core';

import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-recommendation-issues',
  templateUrl: './recommendation-issues.component.html',
})
export class RecommendationIssuesComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.dashboardService.getAllIssues();
  }
}
