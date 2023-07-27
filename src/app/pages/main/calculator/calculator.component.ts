import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  show = false;
  description: string =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam consequatur neque dolor earum, dolorem iste maxime nam distinctio omnis repudiandae tempore similique aliquid animi exercitationem obcaecati ullam corrupti dolorum expedita.';

  constructor() {}

  ngOnInit(): void {}
}
