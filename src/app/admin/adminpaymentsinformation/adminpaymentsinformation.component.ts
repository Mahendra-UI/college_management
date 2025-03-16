import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adminpaymentsinformation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminpaymentsinformation.component.html',
  styleUrl: './adminpaymentsinformation.component.scss'
})
export class AdminpaymentsinformationComponent implements OnInit {
  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    
  }
}
