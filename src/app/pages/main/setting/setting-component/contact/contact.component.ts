import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  isLoading: boolean = false;
  contactList: any = [];

  constructor() {}

  ngOnInit(): void {}

  goBack() {
    window.history.back();
  }
}
