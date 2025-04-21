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
      this.loadFeeLedgersnew()
        // this.loadFeeLedgers();
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
  


  loadFeeLedgersnew() {
    this.spinner.show();
  
    if (this.username) {
      this.apiSer.getFeeLedgerByUsername(this.username).subscribe(
        (res: any) => {
          if (res.success) {
            const ledgerMap = new Map<string, any>();
  
            res.feeLedgers.forEach((ledger: any) => {
              const key = `${ledger.fee_type_name}-${ledger.semester_name}`;
  
              if (!ledgerMap.has(key)) {
                ledgerMap.set(key, ledger); // first one
              } else {
                const existing = ledgerMap.get(key);
                const currentUpdated = new Date(ledger.updated_at).getTime();
                const existingUpdated = new Date(existing.updated_at).getTime();
  
                if (currentUpdated < existingUpdated) {
                  ledgerMap.set(key, ledger); // replace with older
                }
              }
            });
  
            this.feeLedersList = Array.from(ledgerMap.values());
  
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
  
            console.log("✅ Loaded Unique Fee Ledgers (Oldest by updated_at):", this.feeLedersList);
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
