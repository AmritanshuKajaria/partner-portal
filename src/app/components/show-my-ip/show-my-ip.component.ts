import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-show-my-ip',
  templateUrl: './show-my-ip.component.html',
  styleUrls: ['./show-my-ip.component.scss'],
})
export class ShowMyIpComponent {
  myIpAddress: string = '';
  isLoading: boolean = true;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {
    this.httpClient.get('https://api.ipify.org?format=json').subscribe({
      next: (res: any) => {
        console.log('IP Address :', res);
        this.myIpAddress = res?.ip;
        this.isLoading = false;
      },
      error: (er) => {
        console.log('IP Address Error :', er);
        if (!er?.error_shown) {
          this.message.create('error', 'something went wrong!');
        }

        this.isLoading = false;
      },
    });
  }
  ngOnInit(): void {}
}
