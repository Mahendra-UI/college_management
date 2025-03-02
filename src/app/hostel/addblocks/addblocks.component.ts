import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-addblocks',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addblocks.component.html',
  styleUrl: './addblocks.component.scss'
})
export class AddblocksComponent implements OnInit {
  blockForm!: FormGroup;
  blocksList: any[] = [];
  hostels: any[] = [];
  isLoading = false;
  isUpdating = false;
  selectedBlockId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllHostels();
    this.getAllBlocks();  // 🔥 Fetch all blocks when component loads
  }

  // Initialize Form with Validations
  initializeForm() {
    this.blockForm = this.fb.group({
      block_name: ['', [Validators.required, Validators.minLength(2)]],
      hostel_id: ['', Validators.required]
    });
  }

  // Fetch Hostels
  getAllHostels() {
    this.isLoading = true;
    this.apiSer.getHostels().subscribe(
      (res) => {
        this.hostels = res.hostels;
        this.isLoading = false;
      },
      () => {
        this.toastr.error('Failed to fetch hostels!', 'Error');
        this.isLoading = false;
      }
    );
  }

  // 🔥 Fetch ALL Blocks (Directly, No Filtering)
  getAllBlocks() {
    this.isLoading = true;
    this.apiSer.getBlocks().subscribe(
      (res) => {
        this.blocksList = res.blocks;
        this.isLoading = false;
      },
      () => {
        this.toastr.error('Failed to fetch blocks!', 'Error');
        this.isLoading = false;
      }
    );
  }

  // Add or Update Block
  submitBlock() {
    if (this.blockForm.invalid) {
      this.toastr.warning('Please enter valid block data!', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const blockData = this.blockForm.value;

    if (this.isUpdating && this.selectedBlockId) {
      // Update Block
      this.apiSer.updateBlock({ ...blockData, block_id: this.selectedBlockId }).subscribe(
        () => {
          this.toastr.success('Block updated successfully!', 'Success');
          this.resetForm();
          this.getAllBlocks(); // 🔥 Refresh blocks list
        },
        () => {
          this.toastr.error('Failed to update block!', 'Error');
          this.isLoading = false;
        }
      );
    } else {
      // Add Block
      this.apiSer.addBlock(blockData).subscribe(
        () => {
          this.toastr.success('Block added successfully!', 'Success');
          this.resetForm();
          this.getAllBlocks(); // 🔥 Refresh blocks list
        },
        () => {
          this.toastr.error('Failed to add block!', 'Error');
          this.isLoading = false;
        }
      );
    }
  }

  // Edit Block
  editBlock(block_id: number) {
    this.isUpdating = true;
    this.selectedBlockId = block_id;
    this.isLoading = true;
  
    this.apiSer.getBlockById(block_id).subscribe(
      (res) => {
        if (res.success) {
          this.blockForm.patchValue({
            block_name: res.block.block_name,
            hostel_id: res.block.hostel_id
          });
        } else {
          this.toastr.warning('Block not found!', 'Warning');
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Failed to fetch block details!', 'Error');
        this.isLoading = false;
      }
    );
  }
  

  // Delete Block with Confirmation
  deleteBlock(block_id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this block!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.apiSer.deleteBlock(block_id).subscribe(
          () => {
            this.toastr.success('Block deleted successfully!', 'Success');
            this.getAllBlocks(); // 🔥 Refresh blocks list
          },
          () => {
            this.toastr.error('Failed to delete block!', 'Error');
            this.isLoading = false;
          }
        );
      }
    });
  }

  // Reset Form
  resetForm() {
    this.blockForm.reset();
    this.isUpdating = false;
    this.selectedBlockId = null;
    this.isLoading = false;
  }
}
