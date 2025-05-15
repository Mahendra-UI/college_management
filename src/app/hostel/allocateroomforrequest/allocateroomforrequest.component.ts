import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Tooltip } from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-allocateroomforrequest',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './allocateroomforrequest.component.html',
  styleUrl: './allocateroomforrequest.component.scss'
})
export class AllocateroomforrequestComponent implements OnInit  {

  filteredRequests: any[] = []; // Filtered requests for search
  searchQuery: string = ''; // Search input

  // ✅ Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 50;


  // @ViewChild('tooltipButton', { static: false }) tooltipButton!: ElementRef;

  roomRequests: any[] = []; // Store all room requests
  selectedRequest: any = null; // Stores selected request for modal
  allocateRoomForm!: FormGroup;
  hostels: any[] = [];
  blocks: any[] = [];
  floors: any[] = [];
  rooms: any[] = [];
  approvedRequests: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoomRequests();
    this.getApprovedRequests();
    this.getHostels();
  }

  /** ✅ Initialize Form */
  initializeForm(): void {
    this.allocateRoomForm = this.fb.group({
      request_id: ['', [Validators.required]],
      hostel_id: ['', [Validators.required]], // Disabled to prevent modification
      block_id: ['', [Validators.required]],
      floor_id: ['', [Validators.required]],
      room_id: ['', [Validators.required]],
    });
  }
  

  /** ✅ Fetch Approved Room Requests */
  getApprovedRequests(): void {
    this.apiSer.getRoomRequests().subscribe(
      (res) => {
        if (res.success) {
          this.approvedRequests = res.requests;
        } else {
          this.approvedRequests = [];
        }
      },
      (error) => {
        console.error("❌ Error fetching approved requests:", error);
      }
    );
  }

  /** ✅ Fetch Hostels */
  getHostels(): void {
    this.apiSer.getHostels().subscribe(
      (res) => {
        if (res.success) {
          this.hostels = res.hostels;
          console.log("Hostels loaded:", this.hostels); // Verify hostels data
        } else {
          console.error("Failed to load hostels");
          this.hostels = [];
        }
      },
      (error) => {
        console.error("Error fetching hostels:", error);
      }
    );
  }
  


  getBlocks(): void {
    const hostelId = this.allocateRoomForm.value.hostel_id;
    if (!hostelId) {
      console.error("❌ No hostel selected.");
      return; // If no hostel is selected, exit the method
    }
  
    console.log("Fetching blocks for Hostel ID:", hostelId);  // Debugging line
  
    this.apiSer.getBlocksByHostel(hostelId).subscribe(
      (res) => {
        if (res.success) {
          this.blocks = res.blocks;
          this.allocateRoomForm.controls['block_id'].markAsTouched();
          console.log("✅ Blocks Loaded:", this.blocks);
        } else {
          this.blocks = [];
          this.toastr.error("Failed to load blocks for the selected hostel.", "Error");
        }
      },
      (error) => {
        console.error("❌ Error fetching blocks:", error);
        this.toastr.error("Something went wrong while fetching blocks.", "Error");
      }
    );
  }
  
  
  

  getBlocksold(): void {
    const hostelId = this.allocateRoomForm.value.hostel_id;
    if (!hostelId) return;
  
    this.apiSer.getBlocksByHostel(hostelId).subscribe((res) => {
      if (res.success) {
        this.blocks = res.blocks;
        this.allocateRoomForm.controls['block_id'].markAsTouched();
      }
    });
  }
  
  getFloors(): void {
    const { hostel_id, block_id } = this.allocateRoomForm.value;
  
    console.log("Checking Values - Hostel ID:", hostel_id, "Block ID:", block_id);  // Debugging line
    
    if (!hostel_id || !block_id) {
      console.error("❌ Hostel ID or Block ID is missing");
      return; // Exit the function if either hostel or block is not selected
    }
    
    console.log("Fetching floors for Hostel ID:", hostel_id, "and Block ID:", block_id);  // Debugging line
  
    this.apiSer.getFloorsByBlockAndHostel(block_id, hostel_id).subscribe((res) => {
      if (res.success) {
        this.floors = res.floors;
        console.log("✅ Floors Loaded:", this.floors); // Debugging line
        this.allocateRoomForm.controls['floor_id'].markAsTouched(); // Mark as touched to trigger validation
      } else {
        this.floors = []; // Reset floors if response is not successful
        this.toastr.error("Failed to load floors for the selected block.", "Error");
      }
    }, (error) => {
      console.error("❌ Error fetching floors:", error);
      this.toastr.error("Something went wrong while fetching floors.", "Error");
    });
  }
  

  getFloorsold(): void {
    const { hostel_id, block_id } = this.allocateRoomForm.value;
    if (!hostel_id || !block_id) return;
  
    this.apiSer.getFloorsByBlockAndHostel(block_id, hostel_id).subscribe((res) => {
      if (res.success) {
        this.floors = res.floors;
        this.allocateRoomForm.controls['floor_id'].markAsTouched();
      }
    });
  }
  



getRooms(): void {
  const { hostel_id, block_id, floor_id } = this.allocateRoomForm.value;
  if (!hostel_id || !block_id || !floor_id) return;

  // Fetch rooms based on hostel_id, block_id, and floor_id
  this.apiSer.getRoomsByHostelBlockFloor(hostel_id, block_id, floor_id).subscribe(
    (res) => {
      if (res.success) {
        this.rooms = res.rooms;
        // Mark room field as touched to trigger validation
        this.allocateRoomForm.controls['room_id'].markAsTouched();
        console.log("✅ Rooms Loaded:", this.rooms);
      } else {
        this.rooms = [];
        this.toastr.error("Failed to load rooms for the selected floor.", "Error");
      }
    },
    (error) => {
      console.error("❌ Error fetching rooms:", error);
      this.toastr.error("Something went wrong while fetching rooms.", "Error");
    }
  );
}


  getRoomsold(): void {
    const { hostel_id, block_id, floor_id } = this.allocateRoomForm.value;
    if (!hostel_id || !block_id || !floor_id) return;
  
    this.apiSer.getRoomsByHostelBlockFloor(hostel_id, block_id, floor_id).subscribe((res) => {
      if (res.success) {
        this.rooms = res.rooms;
        this.allocateRoomForm.controls['room_id'].markAsTouched();
      }
    });
  }
  


  /** ✅ Allocate Room to Student */

  allocateRoom(): void {
    if (this.allocateRoomForm.invalid) {
        Swal.fire('⚠️ Warning', 'Please fill all required fields.', 'warning');
        this.toastr.warning("Please fill all required fields", "Warning");
        return;
    }

    const payload = this.allocateRoomForm.value; // ✅ Send the form data directly

    console.log("🚀 Submitting Data:", payload);

    this.spinner.show();
    this.isLoading = true;

    this.apiSer.allocateRoomWithRequest(payload).subscribe(
        (res) => {
            this.spinner.hide();
            this.isLoading = false;

            if (res.success) {
                Swal.fire('✅ Success', 'Room allocated successfully!', 'success');
                this.toastr.success("Room allocated successfully!", "Success");
                this.allocateRoomForm.reset();
            } else {
                Swal.fire('❌ Error', res.message, 'error');
                this.toastr.error(res.message, "Error");
            }
        },
        (error) => {
            this.spinner.hide();
            this.isLoading = false;

            console.error("❌ Allocation API Error:", error);
            const errorMessage = error?.error?.message || "Failed to allocate room. Please try again.";

            Swal.fire('❌ Error', errorMessage, 'error');
            this.toastr.error(errorMessage, "Error");
        }
    );
}


/** ✅ Fetch All Room Requests */
loadRoomRequestsnew(): void {
  this.spinner.show();
  this.apiSer.getRoomRequests().subscribe(
    (res) => {
      this.spinner.hide();
      if (res.success) {
        this.roomRequests = res.requests.sort().reverse();
        this.filteredRequests = [...this.roomRequests]; // ✅ Initialize filtered list
      } else {
        this.toastr.info("No room requests found.", "Info");
        this.roomRequests = [];
        this.filteredRequests = [];
      }
    },
    (error) => {
      this.spinner.hide();
      console.error("❌ Error fetching room requests:", error);
      this.toastr.error("Failed to load requests.", "Error");
    }
  );
}

/** ✅ Filtering Function */
filterRequests() {
  this.filteredRequests = this.roomRequests.filter(req =>
    Object.values(req).some((value: any) =>
      value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    )
  );
  this.currentPage = 1; // ✅ Reset to first page on new search
}


loadRoomRequests(): void {
  this.spinner.show();
  this.apiSer.getRoomRequests().subscribe(
    (res) => {
      this.spinner.hide();
      if (res.success) {
        this.roomRequests = res.requests.sort().reverse(); // Sort and reverse the room requests
        this.filteredRequests = [...this.roomRequests]; // Initialize the filtered list

        // If there is a hostel_id in the room request, load the blocks automatically
        this.filteredRequests.forEach((request: any) => {
          if (request.hostel_id) {
            this.loadBlocksByHostel(request.hostel_id);
          }
        });

      } else {
        this.toastr.info("No room requests found.", "Info");
        this.roomRequests = [];
        this.filteredRequests = [];
      }
    },
    (error) => {
      this.spinner.hide();
      console.error("❌ Error fetching room requests:", error);
      this.toastr.error("Failed to load requests.", "Error");
    }
  );
}

loadBlocksByHostel(hostelId: number): void {
  // Fetch the blocks based on the hostel_id
  this.apiSer.getBlocksByHostel(hostelId).subscribe((res) => {
    if (res.success) {
      this.blocks = res.blocks; // Store the blocks related to the selected hostel
    } else {
      console.error("❌ Error fetching blocks for hostel:", hostelId);
    }
  }, (error) => {
    console.error("❌ Error fetching blocks:", error);
  });
}


/** ✅ Get Displayed Records Count */
displayedRecordsCount(): number {
  return Math.min(
    this.filteredRequests.length - (this.currentPage - 1) * this.itemsPerPage,
    this.itemsPerPage
  );
}

  
  loadRoomRequestsold(): void {
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


  checkFormValidity(): void {
    this.allocateRoomForm.updateValueAndValidity();
    console.log("✅ Form Revalidated:", this.allocateRoomForm.valid);
  }
  
/** ✅ Debug why form is invalid */
debugFormValidity(): void {
  console.log("🚀 Form Value:", this.allocateRoomForm.value);
  console.log("📌 Form Valid:", this.allocateRoomForm.valid);

  Object.keys(this.allocateRoomForm.controls).forEach((key) => {
    console.log(`⚠️ ${key} - Value:`, this.allocateRoomForm.controls[key].value);
    console.log(`⚠️ ${key} - Valid:`, this.allocateRoomForm.controls[key].valid);
    console.log(`⚠️ ${key} - Errors:`, this.allocateRoomForm.controls[key].errors);
    console.log(`⚠️ ${key} - Touched:`, this.allocateRoomForm.controls[key].touched);
  });

  if (this.allocateRoomForm.invalid) {
    this.allocateRoomForm.markAllAsTouched(); // Force UI to show errors
  }
}


openActionModaloldnew(requestId: number): void {
  this.apiSer.getRoomRequestById(requestId).subscribe(
    (res) => {
      if (res.success && res.request) {
        console.log("API Response:", res);  // Check the entire response

        this.selectedRequest = res.request;
        console.log("Loaded Request:", this.selectedRequest);  // Verify the hostel_id

        // Check if hostel_id exists in the response
        console.log("Hostel ID from request:", this.selectedRequest.hostel_id);

        // Set hostel_id for testing (make sure this works)
        if (!this.selectedRequest.hostel_id) {
          this.selectedRequest.hostel_id = 1;  // Static value for testing
        }

        // Patch the values in the form
        this.allocateRoomForm.patchValue({
          request_id: this.selectedRequest.request_id,
          hostel_id: this.selectedRequest.hostel_id || '',  // Set hostel_id
          block_id: this.selectedRequest.block_id || '', 
          floor_id: this.selectedRequest.floor_id || '', 
          room_id: this.selectedRequest.room_id || ''
        });

        // Check the values after patching
        console.log("Hostel ID after patching:", this.allocateRoomForm.get('hostel_id')?.value);

        // Fetch and update dependent data (blocks, floors, rooms)
        this.getBlocks(); // Load blocks based on hostel_id
        this.getFloors();
        this.getRooms();

        this.allocateRoomForm.updateValueAndValidity();
      } else {
        this.toastr.error("Request not found", "Error");
      }
    },
    (error) => {
      console.error("❌ API Error:", error);
      this.toastr.error("Failed to fetch request", "Error");
    }
  );
}

openActionModal(requestId: number): void {
  this.apiSer.getRoomRequestById(requestId).subscribe(
    (res) => {
      if (res.success && res.request) {
        this.selectedRequest = res.request;

        // Set default hostel_id if missing
        if (!this.selectedRequest.hostel_id) {
          this.selectedRequest.hostel_id = 1;
        }

        this.allocateRoomForm.patchValue({
          request_id: this.selectedRequest.request_id,
          hostel_id: this.selectedRequest.hostel_id || '',
          block_id: this.selectedRequest.block_id || '',
          floor_id: this.selectedRequest.floor_id || '',
          room_id: this.selectedRequest.room_id || ''
        });
        // this.allocateRoomForm.get('hostel_id')?.disable();


        this.getBlocks();
        this.getFloors();
        this.getRooms();
        this.allocateRoomForm.updateValueAndValidity();

        // ✅ Log or use gender now
        console.log("Gender of request:", this.selectedRequest.gender);
      } else {
        this.toastr.error("Request not found", "Error");
      }
    },
    (error) => {
      console.error("❌ API Error:", error);
      this.toastr.error("Failed to fetch request", "Error");
    }
  );
}





openActionModalold(requestId: number): void {
  this.apiSer.getRoomRequestById(requestId).subscribe(
    (res) => {
      if (res.success && res.request) {
        this.selectedRequest = res.request;

        // ✅ Populate the form with request details
        this.allocateRoomForm.patchValue({
          request_id: this.selectedRequest.request_id,
          hostel_id: this.selectedRequest.hostel_id || '', 
          block_id: this.selectedRequest.block_id || '', 
          floor_id: this.selectedRequest.floor_id || '', 
          room_id: this.selectedRequest.room_id || ''
        });

        console.log("✅ Room Request Data Loaded:", this.selectedRequest);

        // ✅ Fetch and update dependent data (blocks, floors, rooms)
        this.getBlocks();
        this.getFloors();
        this.getRooms();

        // ✅ Force Angular to detect changes
        this.allocateRoomForm.updateValueAndValidity();
      } else {
        this.toastr.error("Request not found", "Error");
      }
    },
    (error) => {
      console.error("❌ API Error:", error);
      this.toastr.error("Failed to fetch request", "Error");
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

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     if (this.tooltipButton) {
  //       new Tooltip(this.tooltipButton.nativeElement, {
  //         trigger: 'hover'
  //       });
  //     }
  //   }, 500); // Wait for DOM rendering
  // }
  
}


