import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addfloors',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addfloors.component.html',
  styleUrl: './addfloors.component.scss'
})
export class AddfloorsComponent implements OnInit {
  floorForm!: FormGroup;
  floorsList: any[] = [];
  hostels: any[] = [];
  blocks: any[] = [];
  isUpdating = false;
  selectedFloorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private apiSer: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllHostels();
    this.getAllFloors();
  }

  // ✅ Initialize form with validations
  initializeForm() {
    this.floorForm = this.fb.group({
      floor_name: ['', [Validators.required, Validators.minLength(2)]],
      hostel_id: ['', Validators.required],
      block_id: ['', Validators.required]
    });

    // Fetch blocks when hostel_id changes
    this.floorForm.get('hostel_id')?.valueChanges.subscribe((hostelId) => {
      if (hostelId) {
        this.getBlocksByHostel(hostelId);
      }
    });
  }

  // ✅ Get all hostels
  getAllHostels() {
    this.apiSer.getHostels().subscribe(
      (res) => (this.hostels = res.hostels),
      () => this.toastr.error('Failed to fetch hostels!', 'Error')
    );
  }

  // ✅ Get blocks by hostel ID and optionally pre-select a block
  getBlocksByHostel(hostelId: number, selectedBlockId?: number) {
    this.apiSer.getBlocksByHostel(hostelId).subscribe(
      (res) => {
        this.blocks = res.blocks;

        // Ensure block_id is set only after blocks are loaded
        setTimeout(() => {
          if (selectedBlockId) {
            this.floorForm.patchValue({ block_id: selectedBlockId });
          }
        }, 100);
      },
      () => this.toastr.error('Failed to fetch blocks!', 'Error')
    );
  }

  // ✅ Get all floors
  getAllFloors() {
    this.apiSer.getFloors().subscribe(
      (res) => (this.floorsList = res.floors),
      () => this.toastr.error('Failed to fetch floors!', 'Error')
    );
  }

  // ✅ Add or Update Floor
  submitFloor() {
    if (this.floorForm.invalid) {
      this.toastr.warning('Please enter valid floor details!', 'Validation Error');
      return;
    }

    this.spinner.show();
    const floorData = this.floorForm.value;

    if (this.isUpdating && this.selectedFloorId) {
      // ✅ Update Floor
      this.apiSer.updateFloor({ ...floorData, floor_id: this.selectedFloorId }).subscribe(
        () => {
          this.toastr.success('Floor updated successfully!', 'Success');
          this.resetForm();
          this.getAllFloors();
        },
        () => {
          this.toastr.error('Failed to update floor!', 'Error');
          this.spinner.hide();
        }
      );
    } else {
      // ✅ Add Floor
      this.apiSer.addFloor(floorData).subscribe(
        () => {
          this.toastr.success('Floor added successfully!', 'Success');
          this.resetForm();
          this.getAllFloors();
        },
        () => {
          this.toastr.error('Failed to add floor!', 'Error');
          this.spinner.hide();
        }
      );
    }
  }

  // ✅ Edit Floor (Fetches floor details and updates form)
  editFloor(floor_id: number) {
    this.isUpdating = true;
    this.selectedFloorId = floor_id;
    this.spinner.show();

    this.apiSer.getFloorById(floor_id).subscribe(
      (res) => {
        if (res.success) {
          const floorData = res.floor;

          // Step 1: Set hostel_id first
          this.floorForm.patchValue({
            floor_name: floorData.floor_name,
            hostel_id: floorData.hostel_id
          });

          // Step 2: Fetch blocks based on selected hostel
          this.getBlocksByHostel(floorData.hostel_id, floorData.block_id);
        } else {
          this.toastr.warning('Floor not found!', 'Warning');
        }
        this.spinner.hide();
      },
      () => {
        this.toastr.error('Failed to fetch floor details!', 'Error');
        this.spinner.hide();
      }
    );
  }

  // ✅ Delete Floor with Confirmation
  deleteFloor(floorId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this floor!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show(); // ✅ Show Spinner before calling API
  
        this.apiSer.deleteFloor(floorId).subscribe(
          () => {
            this.toastr.success('Floor deleted successfully!', 'Success');
            this.getAllFloors();
            this.spinner.hide(); // ✅ Hide Spinner on success
          },
          () => {
            this.toastr.error('Failed to delete floor!', 'Error');
            this.spinner.hide(); // ✅ Hide Spinner on error
          }
        );
      } else {
        this.spinner.hide(); // ✅ Hide Spinner if user cancels
      }
    });
  }
  

  // ✅ Reset Form
  resetForm() {
    this.floorForm.reset();
    this.isUpdating = false;
    this.selectedFloorId = null;
    this.spinner.hide();
  }
}
