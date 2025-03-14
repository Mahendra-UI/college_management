import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sibiling2Component } from '../sibiling2/sibiling2.component';
import { CommonserviceService } from '../../services/commonservice.service';

@Component({
  selector: 'app-sibiling1',
  standalone: true,
  imports: [CommonModule, RouterModule, Sibiling2Component],
  templateUrl: './sibiling1.component.html',
  styleUrl: './sibiling1.component.scss'
})
export class Sibiling1Component {
  constructor(private commonSer: CommonserviceService) {

  }

  sendMessage() {
    this.commonSer.changeMessage('message from sibiling 1');
  }

}
