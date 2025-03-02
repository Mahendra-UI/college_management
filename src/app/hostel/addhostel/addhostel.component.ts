import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addhostel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addhostel.component.html',
  styleUrl: './addhostel.component.scss'
})
export class AddhostelComponent implements OnInit {
  hostelForm!: FormGroup;
  hostels: any[] = [];
  isLoading = false;
  isUpdating = false;
  selectedHostelId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllHostels();
  }

  // Initialize Form with Validations
  initializeForm() {
    this.hostelForm = this.fb.group({
      hostel_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  // Get All Hostels
  getAllHostels() {
    this.isLoading = true;
    this.apiSer.getHostels().subscribe(
      (res) => {
        this.hostels = res.hostels;
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Failed to fetch hostels!', 'Error');
        this.isLoading = false;
      }
    );
  }

  // Add or Update Hostel

  submitHostel() {
    if (this.hostelForm.invalid) {
      this.toastr.warning('Please enter a valid hostel name!', 'Validation Error');
      return;
    }
  
    this.isLoading = true;
    const hostelData = {
      hostel_id: this.selectedHostelId,
      hostel_name: this.hostelForm.value.hostel_name
    };
  
    if (this.isUpdating) {
      this.apiSer.updateHostel(hostelData).subscribe(
        (res) => {
          this.toastr.success('Hostel updated successfully!', 'Success');
          this.resetForm();
          this.getAllHostels();
        },
        (error) => {
          this.toastr.error('Failed to update hostel!', 'Error');
          this.isLoading = false;
        }
      );
    } else {
      this.apiSer.addHostel({ hostel_name: this.hostelForm.value.hostel_name }).subscribe(
        (res) => {
          this.toastr.success('Hostel added successfully!', 'Success');
          this.resetForm();
          this.getAllHostels();
        },
        (error) => {
          this.toastr.error('Failed to add hostel!', 'Error');
          this.isLoading = false;
        }
      );
    }
  }
    


  // Edit Hostel
  editHostel(hostel_id: number) {
    this.isUpdating = true;
    this.selectedHostelId = hostel_id;
    this.isLoading = true;
  
    // Fetch latest hostel details from API
    this.apiSer.getHostelById(hostel_id).subscribe(
      (res) => {
        if (res.success) {
          this.hostelForm.patchValue({ hostel_name: res.hostel.hostel_name });
        } else {
          this.toastr.warning('Hostel not found!', 'Warning');
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Failed to fetch hostel details!', 'Error');
        this.isLoading = false;
      }
    );
  }
  
  // Delete Hostel
  deleteHostel(hostel_id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this hostel!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.apiSer.deleteHostel(hostel_id).subscribe(
          (res) => {
            this.toastr.success('Hostel deleted successfully!', 'Success');
            this.getAllHostels();
          },
          (error) => {
            this.toastr.error('Failed to delete hostel!', 'Error');
            this.isLoading = false;
          }
        );
      }
    });
  }
  

  // Reset Form
  resetForm() {
    this.hostelForm.reset();
    this.isUpdating = false;
    this.selectedHostelId = null;
    this.isLoading = false;
  }
}
