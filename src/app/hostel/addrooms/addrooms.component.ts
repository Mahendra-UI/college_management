import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addrooms',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addrooms.component.html',
  styleUrl: './addrooms.component.scss'
})
export class AddroomsComponent implements OnInit {
  roomForm!: FormGroup;
  hostels: any[] = [];
  blocks: any[] = [];
  floors: any[] = [];
  roomsList: any[] = [];
  isUpdating = false;
  selectedRoomId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private apiSer: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllHostels();
    this.getAllRooms();
  }

  // Initialize Form
  initializeForm() {
    this.roomForm = this.fb.group({
      hostel_id: ['', Validators.required],
      block_id: ['', Validators.required],
      floor_id: ['', Validators.required],
      room_name: ['', [Validators.required, Validators.minLength(2)]],
      seats: ['', [Validators.required, Validators.min(1)]]
    });

    // Fetch Blocks when hostel is selected
    this.roomForm.get('hostel_id')?.valueChanges.subscribe((hostelId) => {
      if (hostelId) {
        this.getBlocksByHostel(hostelId);
        this.floors = []; // Reset floors when hostel changes
      }
    });

    // Fetch Floors when block is selected
    this.roomForm.get('block_id')?.valueChanges.subscribe((blockId) => {
      if (blockId) {
        const hostelId = this.roomForm.get('hostel_id')?.value;
        if (hostelId) {
          this.getFloorsByBlockAndHostel(blockId, hostelId);
        }
      }
    });
  }

  // Fetch Hostels
  getAllHostels() {
    this.apiSer.getHostels().subscribe(
      (res) => (this.hostels = res.hostels),
      () => this.toastr.error('Failed to fetch hostels!', 'Error')
    );
  }

  getBlocksByHostel(hostelId: number) {
    this.apiSer.getBlocksByHostel(hostelId).subscribe(
      (res) => {
        this.blocks = res.blocks;
      },
      () => {
        this.toastr.error('Failed to fetch blocks!', 'Error');
      }
    );
  }
  
  getFloorsByBlockAndHostel(blockId: number, hostelId: number) {
    this.apiSer.getFloorsByBlockAndHostel(blockId, hostelId).subscribe(
      (res) => {
        this.floors = res.floors;
      },
      () => {
        this.toastr.error('Failed to fetch floors!', 'Error');
      }
    );
  }
  

  // Fetch All Rooms
  getAllRooms() {
    this.apiSer.getRooms().subscribe(
      (res) => (this.roomsList = res.rooms),
      () => this.toastr.error('Failed to fetch rooms!', 'Error')
    );
  }

  // Add or Update Room
  submitRoom() {
    if (this.roomForm.invalid) {
      this.toastr.warning('Please enter valid room details!', 'Validation Error');
      return;
    }

    this.spinner.show();
    const roomData = this.roomForm.value;

    if (this.isUpdating && this.selectedRoomId) {
      // Update Room
      this.apiSer.updateRoom({ ...roomData, room_id: this.selectedRoomId }).subscribe(
        () => {
          this.toastr.success('Room updated successfully!', 'Success');
          this.resetForm();
          this.getAllRooms();
        },
        () => {
          this.toastr.error('Failed to update room!', 'Error');
          this.spinner.hide();
        }
      );
    } else {
      // Add Room
      this.apiSer.addRoom(roomData).subscribe(
        () => {
          this.toastr.success('Room added successfully!', 'Success');
          this.resetForm();
          this.getAllRooms();
        },
        () => {
          this.toastr.error('Failed to add room!', 'Error');
          this.spinner.hide();
        }
      );
    }
  }


  editRoom(roomId: number) {
    this.isUpdating = true;
    this.selectedRoomId = roomId;
    this.spinner.show();
  
    this.apiSer.getRoomById(roomId).subscribe(
      (res) => {
        if (res.success) {
          const roomData = res.room;
          console.log(roomData, "room data");
  
          // Step 1: Set hostel_id and fetch blocks
          this.roomForm.patchValue({ hostel_id: roomData.hostel_id });
          this.getBlocksByHostel(roomData.hostel_id);
  
          // Step 2: Delay setting block_id until blocks are loaded
          setTimeout(() => {
            this.roomForm.patchValue({ block_id: roomData.block_id });
            this.getFloorsByBlockAndHostel(roomData.block_id, roomData.hostel_id);
          }, 500);
  
          // Step 3: Delay setting floor_id until floors are loaded
          setTimeout(() => {
            this.roomForm.patchValue({
              floor_id: roomData.floor_id,
              room_name: roomData.room_name,
              seats: roomData.seats
            });
          }, 1000);
          
        } else {
          this.toastr.warning('Room not found!', 'Warning');
        }
        this.spinner.hide();
      },
      () => {
        this.toastr.error('Failed to fetch room details!', 'Error');
        this.spinner.hide();
      }
    );
  }
  
  
  deleteRoom(roomId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this room!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.apiSer.deleteRoom(roomId).subscribe(
          () => {
            this.toastr.success('Room deleted successfully!', 'Success');
            this.getAllRooms();
            this.spinner.hide(); // ✅ Hide spinner after refreshing rooms
          },
          () => {
            this.toastr.error('Failed to delete room!', 'Error');
            this.spinner.hide(); // ✅ Ensure spinner hides on error
          }
        );
      } else {
        this.spinner.hide(); // ✅ Hide spinner if user cancels
      }
    });
  }
  

  // Reset Form
  resetForm() {
    this.roomForm.reset();
    this.isUpdating = false;
    this.selectedRoomId = null;
    this.spinner.hide();
  }
}
