import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-map-handling',
  templateUrl: './map-handling.component.html',
  styleUrls: ['./map-handling.component.scss'],
})
export class MapHandlingComponent implements OnInit {
  isLoading: boolean = false;
  mapHandlingForm!: FormGroup;

  constructor() {}
  ngOnInit(): void {}
}
