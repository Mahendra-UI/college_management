import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adminfeeinfo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminfeeinfo.component.html',
  styleUrl: './adminfeeinfo.component.scss'
})
export class AdminfeeinfoComponent implements OnInit {

  feeStatusList: any[] = [];


  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toaster: ToastrService) {

  }
  ngOnInit(): void {
    this.loadFeeStatus();
  }

/** ✅ Load All Students' Fee Status */
loadFeeStatus() {
  this.apiSer.getAllStudentsFeeStatus().subscribe((res: any) => {
    if (res.success) {
      this.feeStatusList = res.feeStatus;
    } else {
      console.error('No Fee Status found:', res.message);
    }
  });
}

}
