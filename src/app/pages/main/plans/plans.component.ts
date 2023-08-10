import { Component, OnInit } from '@angular/core';
import { planDataObj } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  planDataObj = planDataObj;
  constructor() {}
  ngOnInit(): void {}
}
