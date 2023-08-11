import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-show-reference-code',
  templateUrl: './show-reference-code.component.html',
  styleUrls: ['./show-reference-code.component.scss'],
})
export class ShowReferenceCodeComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() referenceCode: string = '';
  @Input() subTitle: string = '';

  @Output() close = new EventEmitter();

  constructor(private message: NzMessageService) {}
  ngOnInit(): void {}

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.message.create('success', 'Copied to clipboard.');
  }

  submit() {
    this.isVisible = false;
    this.close.emit();
  }
}
