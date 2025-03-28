import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StudentprofileComponent } from '../studentprofile/studentprofile.component';

@Component({
  selector: 'app-mypromotions',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentprofileComponent],
  templateUrl: './mypromotions.component.html',
  styleUrl: './mypromotions.component.scss'
})
export class MypromotionsComponent implements OnInit {
  promotionHistoryList: any[] = [];

  selectedUsername: any = '';



  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toaster: ToastrService) {

  }
  ngOnInit(): void {
    this.selectedUsername = sessionStorage.getItem('username');
    this.loadpromotionHistoryList(this.selectedUsername);
  
  }

  loadpromotionHistoryList(username: string) {
    this.selectedUsername = username; // Store username for modal title
    this.apiSer.getPromotionHistory(username).subscribe(
        (res: any) => {
            if (res.success && res.history.length > 0) {
                this.promotionHistoryList = res.history; // ✅ Store all history records
                console.log("✅ Promotion History Loaded:", this.promotionHistoryList);
            } else {
                this.promotionHistoryList = [];
                this.toaster.warning(res.message || "⚠️ No promotion history found.");
            }
        },
        (error) => {
            this.promotionHistoryList = [];
            console.error("❌ Error fetching promotion history:", error);
            this.toaster.error("Something went wrong while fetching history.");
        }
    );
}

}
