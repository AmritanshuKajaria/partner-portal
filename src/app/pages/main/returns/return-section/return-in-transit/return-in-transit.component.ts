import { Component, OnInit } from '@angular/core';
import { endOfMonth } from 'date-fns';
@Component({
  selector: 'app-return-in-transit',
  templateUrl: './return-in-transit.component.html',
  styleUrls: ['./return-in-transit.component.scss'],
})
export class ReturnInTransitComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  addRaVisible: boolean = false;
  badgeTotal: number = 0;
  ranges = {
    Today: [new Date(), new Date()],
    YesterDay: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
    'Last 7 Days': [
      new Date(new Date().setDate(new Date().getDate() - 6)),
      new Date(new Date()),
    ],
    'Last 30 Days': [
      new Date(new Date().setDate(new Date().getDate() - 29)),
      new Date(new Date()),
    ],
    'This Month': [new Date(), endOfMonth(new Date())],
    'Last Month': [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      new Date(),
    ],
    // Custom: [],
  };

  returnInitiatedList = [
    {
      id: 1,
      po: 'NOU-183',
      invoice: '2 - 8528363',
      customerName: 'maynard j megginson jr megginson jr megginson jr megginson jr megginson jr megginson jr',
      returnClassification: 'Mis-Ship',
      mpn: '99446823823',
      orderQty: '1',
      returnQty: '1',
      raNumber: [
        {
          name: 'AMZ',
          number: '82382',
        },
        {
          name: 'Your',
          number: '82384',
        },
      ],
      trackingNo: {
        name: 'Ekart Logistics',
        number: 'SRTP5737737138',
      },
    },
  ];
  constructor() {}
  ngOnInit(): void {}

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
}
