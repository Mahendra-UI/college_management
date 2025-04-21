import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feeinfo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feeinfo.component.html',
  styleUrl: './feeinfo.component.scss'
})
export class FeeinfoComponent implements OnInit {
  feeLedgersList: any[] = [];
  username: string | null = null;

  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || ''; // ✅ Ensure it's always a string
  
    if (this.username.trim()) {
      this.loadFeeLedgers();
    } else {
      console.error('⚠️ Error: Missing username in sessionStorage');
      this.router.navigate(['/login']);
    }
  }
  

  loadFeeLedgersold() {
    if (!this.username) {
      console.error('⚠️ Error: Username is null, cannot fetch fee ledgers.');
      this.router.navigate(['/login']);
      return;
    }
  
    this.apiSer.getFeeLedgerByUsername(this.username).subscribe((res: any) => {
      if (res.success) {
        this.feeLedgersList = res.feeLedgers;
      } else {
        console.error('No Fee Ledgers found:', res.message);
      }
    });
  }


  loadFeeLedgersoldnew() {
    if (!this.username) {
      console.error('⚠️ Error: Username is null, cannot fetch fee ledgers.');
      this.router.navigate(['/login']);
      return;
    }
  
    this.apiSer.getFeeLedgerByUsername(this.username).subscribe((res: any) => {
      if (res.success) {
        const uniqueSet = new Set<string>();
        this.feeLedgersList = res.feeLedgers.filter((ledger: any) => {
          const key = `${ledger.fee_type_name}-${ledger.semester_name}`;
          if (uniqueSet.has(key)) {
            return false;
          } else {
            uniqueSet.add(key);
            return true;
          }
        });
      } else {
        console.error('No Fee Ledgers found:', res.message);
      }
    });
  }
  
  loadFeeLedgers() {
    if (!this.username) {
      console.error('⚠️ Error: Username is null, cannot fetch fee ledgers.');
      this.router.navigate(['/login']);
      return;
    }
  
    this.apiSer.getFeeLedgerByUsername(this.username).subscribe((res: any) => {
      if (res.success) {
        const ledgerMap = new Map<string, any>();
  
        for (const ledger of res.feeLedgers) {
          const key = `${ledger.fee_type_name}-${ledger.semester_name}`;
  
          if (!ledgerMap.has(key)) {
            ledgerMap.set(key, ledger); // first entry
          } else {
            const existing = ledgerMap.get(key);
            const currentTime = new Date(ledger.updated_at).getTime();
            const existingTime = new Date(existing.updated_at).getTime();
  
            if (currentTime < existingTime) {
              ledgerMap.set(key, ledger); // replace with older one
            }
          }
        }
  
        this.feeLedgersList = Array.from(ledgerMap.values());
        console.log("✅ Final Filtered Fee Ledgers (Oldest only):", this.feeLedgersList);
      } else {
        console.error('No Fee Ledgers found:', res.message);
      }
    });
  }
  
  
  
  

  /** ✅ Redirect to Payment Page */
  payHere(feeLedgerId: number) {
    sessionStorage.setItem('selected_fee_ledger_id', feeLedgerId.toString());
    this.router.navigate(['/student/payment']);
  } 


/** ✅ Redirect to View Receipt Page */
viewReceipt(transactionId: string | null) {
  if (!transactionId) {
    console.error("❌ Transaction ID is missing!");
    alert("Transaction ID is missing! Please contact support.");
    return;
  }

  sessionStorage.setItem('selected_transaction_id', transactionId);
  this.router.navigate(['/student/receipt']);
}


}
