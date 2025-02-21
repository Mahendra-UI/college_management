import { OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent implements OnInit {

  transactionId: string | null = null;
  receiptData: any = null;

  constructor(private apiSer: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.transactionId = sessionStorage.getItem('selected_transaction_id');

    if (!this.transactionId) {
      console.error("❌ No Transaction ID found in sessionStorage!");
      alert("Transaction ID is missing! Redirecting to Fee Information.");
      this.router.navigate(['/student/feeinfo']);
      return;
    }

    this.getReceiptDetails(this.transactionId);
  }

  getReceiptDetails(transactionId: string) {
    this.apiSer.getReceipt(transactionId).subscribe((res: any) => {
      if (res.success) {
        this.receiptData = res.receipt;
      } else {
        console.error('❌ Receipt not found:', res.message);
        alert("Receipt not found! Redirecting to Fee Information.");
        this.router.navigate(['/student/feeinfo']);
      }
    });
  }

  downloadReceipt() {
    const receiptContent = `
      Transaction ID: ${this.receiptData.transaction_id}
      Fee Type: ${this.receiptData.fee_type_name}
      Course: ${this.receiptData.course_name}
      Semester: ${this.receiptData.semester_name}
      Year: ${this.receiptData.year}
      Fee Amount: ₹${this.receiptData.amount_paid}
      Status: ${this.receiptData.payment_status}
    `;
  
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `receipt_${this.receiptData.transaction_id}.txt`;
    anchor.click();
  }
  


}
