import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feeinfo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feeinfo.component.html',
  styleUrl: './feeinfo.component.scss'
})
export class FeeinfoComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) {

  }
  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide(); // ✅ Hide Spinner after timeout
    }, 500); // Hide after 1.5s
  }
}
