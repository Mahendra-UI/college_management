import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hostelroomrequests',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hostelroomrequests.component.html',
  styleUrl: './hostelroomrequests.component.scss'
})
export class HostelroomrequestsComponent implements OnInit {


  full_name: string | null = null;


  roomRequests: any[] = []; // Store all room requests
  actionForm!: FormGroup; // Form for approving/rejecting requests
  selectedRequest: any = null; // Stores selected request for modal
  isLoading = false; // Loader flag

  selectedRequestId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.full_name = sessionStorage.getItem('full_name') || sessionStorage.getItem('fullName'); // Handles both variations
    this.loadRoomRequests();
    this.initializeForm();
  }

  /** ✅ Initialize Reactive Form */
  initializeForm(): void {
    this.actionForm = this.fb.group({
      status: ['', Validators.required], // 'Approved' or 'Rejected'
      remarks: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  /** ✅ Fetch All Room Requests */
  loadRoomRequests(): void {
    this.spinner.show();
    this.apiSer.getRoomRequests().subscribe(
      (res) => {
        this.spinner.hide();
        if (res.success) {
          this.roomRequests = res.requests;
          console.log("📜 Room Requests:", this.roomRequests);
        } else {
          this.toastr.info("No room requests found.", "Info");
        }
      },
      (error) => {
        this.spinner.hide();
        console.error("❌ Error fetching room requests:", error);
        this.toastr.error("Failed to load requests.", "Error");
      }
    );
  }

  /** ✅ Open Bootstrap Modal for Action */
  openActionModal(request: any): void {
    this.selectedRequest = request;
    this.actionForm.reset(); // Reset form before opening
    // let modal = new bootstrap.Modal(document.getElementById('actionModal')!);
    // modal.show();
  }

  /** ✅ Submit Action (Approve/Reject) */

  submitAction(): void {
    if (this.actionForm.invalid) {
        Swal.fire('⚠️ Warning', 'Please fill all required fields.', 'warning');
        return;
    }

    if (!this.full_name || this.full_name.trim() === '') {
        Swal.fire('❌ Error', 'User identity missing! Please log in again.', 'error');
        return;
    }

    this.spinner.show();
    this.isLoading = true;

    const actionData = {
        request_id: this.selectedRequest.request_id,
        status: this.actionForm.value.status,
        remarks: this.actionForm.value.remarks,
        performed_by: this.full_name // ✅ Ensure this holds the logged-in user's name
    };

    this.apiSer.updateRoomRequestStatus(actionData).subscribe(
        (res) => {
            this.spinner.hide();
            this.isLoading = false;

            Swal.fire('✅ Success', `Room request ${actionData.status} successfully!`, 'success');
            this.toastr.success(`Room request ${actionData.status} successfully!`, "Success");
            this.loadRoomRequests(); // Refresh requests
            this.loadRequestHistory(this.selectedRequest.request_id); // Reload history
        },
        (error) => {
            this.spinner.hide();
            this.isLoading = false;
            Swal.fire('❌ Error', 'Failed to update request.', 'error');
            this.toastr.error("Failed to update request.", "Error");
        }
    );
}




  submitActionold(): void {
    if (this.actionForm.invalid) {
        Swal.fire('⚠️ Warning', 'Please fill all required fields.', 'warning');
        return;
    }

    this.spinner.show();
    this.isLoading = true;

    const actionData = {
        request_id: this.selectedRequest.request_id,
        status: this.actionForm.value.status,
        remarks: this.actionForm.value.remarks
    };

    this.apiSer.updateRoomRequestStatus(actionData).subscribe(
        (res) => {
            this.spinner.hide();
            this.isLoading = false;

            Swal.fire('✅ Success', `Room request ${actionData.status} successfully!`, 'success');
            this.toastr.success(`Room request ${actionData.status} successfully!`, "Success");
            this.loadRoomRequests(); // Refresh requests after action
        },
        (error) => {
            this.spinner.hide();
            this.isLoading = false;
            Swal.fire('❌ Error', 'Failed to update request.', 'error');
            this.toastr.error("Failed to update request.", "Error");
        }
    );
}


  loadRoomRequestDetails(requestId: number): void {
    this.apiSer.getRoomRequestByRequestId(requestId).subscribe(
      (res) => {
        if (res.success) {
          this.selectedRequest = res.request;
          console.log("✅ Loaded Room Request:", this.selectedRequest);
        } else {
          this.selectedRequest = null;
          this.toastr.warning("No room request found for this ID.", "Warning");
        }
      },
      (error) => {
        console.error("❌ Error fetching room request:", error);
        this.toastr.error("Failed to load room request. Please try again later.", "Error");
      }
    );
  }
  requestHistory : any[] = [];

  loadRequestHistory(requestId: any) {
    this.selectedRequest = this.roomRequests.find(req => req.request_id === requestId);
    this.apiSer.getRoomRequestHistory(requestId).subscribe(
      (response: any) => {
        if (response.success) {
          this.requestHistory = response.history;
        } else {
          this.requestHistory = [];
        }
      },
      (error) => {
        console.error("Error fetching request history:", error);
        this.requestHistory = [];
      }
    );
  }
   
}
