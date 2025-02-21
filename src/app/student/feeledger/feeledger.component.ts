import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feeledger',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feeledger.component.html',
  styleUrl: './feeledger.component.scss'
})
export class FeeledgerComponent implements OnInit {

  feeLedersList : any[] = [];
  username: string | null = null;
  courseId: number | null = null;



  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toster: ToastrService) {

  }
  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    console.log(this.username, "user name session");
    
    this.courseId = Number(sessionStorage.getItem('courseId'));

    if (this.username) {
        this.loadFeeLedgers();
    } else {
        console.error('⚠️ Error: Missing username in sessionStorage');
    }
  }

  loadFeeLedgers() {
    this.spinner.show();
    
    if (this.username) {
      this.apiSer.getFeeLedgerByUsername(this.username).subscribe(
        (res: any) => {
          if (res.success) {
            setTimeout(() => {
              this.spinner.hide(); // ✅ Hide Spinner after timeout
            }, 500); // Hide after 0.5s
  
            this.feeLedersList = res.feeLedgers; // ✅ Corrected
  
            console.log("✅ Loaded Fee Ledgers:", this.feeLedersList);
          } else {
            this.spinner.hide();
            console.error('⚠️ No Fee Ledgers found:', res.message);
          }
        },
        (error: any) => {
          this.spinner.hide();
          console.error('❌ Error fetching fee ledgers:', error);
        }
      );
    }
  }
  


}
