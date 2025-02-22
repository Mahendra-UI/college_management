import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  feeLedgerId: number | null = null;
  username: string | null = null;
  amount: number = 0;

  constructor(private apiSer: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    const feeLedgerIdStr = sessionStorage.getItem('selected_fee_ledger_id');
  
    this.feeLedgerId = feeLedgerIdStr ? Number(feeLedgerIdStr) : null;
  
    if (!this.feeLedgerId || this.feeLedgerId <= 0) {
      alert("No fee selected for payment!");
      this.router.navigate(['/student/feeinfo']);
    } else {
      // ✅ Fetch fee details for the selected ledger ID
      this.apiSer.getFeeLedgerById(this.feeLedgerId).subscribe((res: any) => {
        if (res.success && res.feeRecord) {
          this.amount = res.feeRecord.fee_amount;
        } else {
          alert("Failed to fetch fee details!");
        }
      });
    }
  }
  
  

  processPayment() {
    if (this.feeLedgerId === null || this.feeLedgerId === 0) {
      alert("Invalid Fee Ledger ID. Please select a valid fee.");
      return;
    }
  
    if (!this.amount || this.amount <= 0) {
      alert("Please enter a valid payment amount!");
      return;
    }
  
    this.apiSer.processPayment(this.feeLedgerId, this.username || "", this.amount).subscribe((res: any) => {
      if (res.success) {
        alert("Payment Successful! Transaction ID: " + res.transaction_id);
        sessionStorage.setItem('transaction_id', res.transaction_id); // ✅ Store Transaction ID
        this.router.navigate(['/student/receipt', res.transaction_id]); // ✅ Redirect to Receipt Page
        
      } else {
        alert("Payment failed! Try again.");
      }
    });
  }  
}