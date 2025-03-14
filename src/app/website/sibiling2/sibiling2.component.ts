import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonserviceService } from '../../services/commonservice.service';

@Component({
  selector: 'app-sibiling2',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sibiling2.component.html',
  styleUrl: './sibiling2.component.scss'
})
export class Sibiling2Component implements OnInit {

  messagefromsibiling1 : any = '';

  constructor(private commonSer: CommonserviceService) {

  }

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage() {
    this.commonSer.currentMessage.subscribe((res) => {
      this.messagefromsibiling1 = res;
    })
  }


}
