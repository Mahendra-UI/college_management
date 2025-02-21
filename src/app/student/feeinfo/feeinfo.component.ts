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
  

  loadFeeLedgers() {
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
