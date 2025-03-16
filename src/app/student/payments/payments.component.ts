import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private apiSer: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    const feeLedgerIdStr = sessionStorage.getItem('selected_fee_ledger_id');

    this.feeLedgerId = feeLedgerIdStr ? Number(feeLedgerIdStr) : null;

    if (!this.feeLedgerId || this.feeLedgerId <= 0) {
      this.toastr.warning('No fee selected for payment!', 'Warning');
      Swal.fire({
        icon: 'warning',
        title: 'No Fee Selected!',
        text: 'Please select a valid fee before making payment.',
        confirmButtonText: 'OK',
      }).then(() => {
        this.router.navigate(['/student/feeinfo']);
      });
      return;
    }

    // ✅ Fetch Fee Details for the Selected Ledger ID
    this.spinner.show();
    this.apiSer.getFeeLedgerById(this.feeLedgerId).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.success && res.feeRecord) {
          this.amount = res.feeRecord.fee_amount;
          this.toastr.success('Fee details fetched successfully!', 'Success');
        } else {
          this.toastr.error('Failed to fetch fee details!', 'Error');
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to fetch fee details. Please try again!',
          });
        }
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Failed to fetch fee details!', 'Error');
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch fee details. Please try again!',
        });
      }
    );
  }

  processPayment() {
    if (this.feeLedgerId === null || this.feeLedgerId === 0) {
      this.toastr.warning('Invalid Fee Ledger ID. Please select a valid fee.', 'Warning');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Fee!',
        text: 'Please select a valid fee before proceeding.',
      });
      return;
    }
  
    if (!this.amount || this.amount <= 0) {
      this.toastr.warning('Please enter a valid payment amount!', 'Warning');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount!',
        text: 'Please enter a valid payment amount.',
      });
      return;
    }
  
    // ✅ Show Spinner Before Payment Processing
    this.spinner.show();
  
    this.apiSer.processPayment(this.feeLedgerId, this.username || '', this.amount).subscribe(
      (res: any) => {
        this.spinner.hide();
  
        if (res.success) {
          this.toastr.success('Payment Successful!', 'Success');
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: `Transaction ID: ${res.transaction_id}`,
            confirmButtonText: 'Go to Fee Info',
          }).then(() => {
            sessionStorage.setItem('transaction_id', res.transaction_id);
            // ✅ Redirect to Fee Info page after success
            this.router.navigate(['/student/feeinfo']);
          });
        } else {
          this.toastr.error('Payment failed! Try again.', 'Error');
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed!',
            text: 'Something went wrong. Please try again.',
          });
        }
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Payment failed! Try again.', 'Error');
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed!',
          text: 'Something went wrong. Please try again.',
        });
      }
    );
  }
  


  processPaymentold() {
    if (this.feeLedgerId === null || this.feeLedgerId === 0) {
      this.toastr.warning('Invalid Fee Ledger ID. Please select a valid fee.', 'Warning');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Fee!',
        text: 'Please select a valid fee before proceeding.',
      });
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.toastr.warning('Please enter a valid payment amount!', 'Warning');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount!',
        text: 'Please enter a valid payment amount.',
      });
      return;
    }

    // ✅ Show Spinner Before Payment Processing
    this.spinner.show();

    this.apiSer.processPayment(this.feeLedgerId, this.username || '', this.amount).subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.success) {
          this.toastr.success('Payment Successful!', 'Success');
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: `Transaction ID: ${res.transaction_id}`,
            confirmButtonText: 'View Receipt',
          }).then(() => {
            sessionStorage.setItem('transaction_id', res.transaction_id);
            this.router.navigate(['/student/receipt', res.transaction_id]);
          });
        } else {
          this.toastr.error('Payment failed! Try again.', 'Error');
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed!',
            text: 'Something went wrong. Please try again.',
          });
        }
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Payment failed! Try again.', 'Error');
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed!',
          text: 'Something went wrong. Please try again.',
        });
      }
    );
  }
}
