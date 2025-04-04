import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-allocatedroomslists',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule],
  templateUrl: './allocatedroomslists.component.html',
  styleUrl: './allocatedroomslists.component.scss'
})
export class AllocatedroomslistsComponent implements OnInit {
  allocatedRooms: any[] = [];
  filteredRooms: any[] = [];
  selectedUsername: string | null = null; // ✅ Stores username from sessionStorage

  currentPage = 1;
  itemsPerPage = 25;
  searchQuery: string = ''; // ✅ Search input

  selectedRequest: any = null; // Stores selected request for modal
  roomRequests: any[] = []; // Store all room requests

  requestHistory : any[] = [];



  isLoading = false;

  constructor(private toastr: ToastrService, private apiSer: ApiService) {}

  ngOnInit(): void {
    this.selectedUsername = sessionStorage.getItem('username');
    console.log(sessionStorage.getItem('username'), "loading username");

    if (!this.selectedUsername) {
      this.toastr.warning("Username not found in session storage!", "Warning");
      return;
    }

    this.fetchAllocatedRooms();
  }

  fetchAllocatedRooms() {
    this.isLoading = true;
    this.apiSer.getAllocatedRoomsByUsername(this.selectedUsername!).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.success) {
          this.allocatedRooms = res.allocatedRooms;
          this.filteredRooms = [...this.allocatedRooms]; // ✅ Initialize filtered list

          if (this.allocatedRooms.length === 0) {
            this.toastr.info("No allocated rooms found!", "Info");
          }
        }
      },
      (err) => {
        this.isLoading = false;
        console.error('❌ Failed to fetch allocated rooms:', err);
        this.toastr.error('Failed to load allocated rooms!', 'Error');
      }
    );
  }

  // ✅ Search Functionality
  filterAllocatedRooms() {
    this.filteredRooms = this.allocatedRooms.filter(room =>
      Object.values(room).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
    this.currentPage = 1; // ✅ Reset to first page on new search
  }

  // ✅ Get Displayed Records Count
  displayedRecordsCount(): number {
    return Math.min(
      this.filteredRooms.length - (this.currentPage - 1) * this.itemsPerPage,
      this.itemsPerPage
    );
  }

  // ✅ Handle pagination page change
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }


  fetchAllocatedRoomsold() {
    this.apiSer.getAllocatedRoomsByUsername(this.selectedUsername!).subscribe(
      (res) => {
        if (res.success) {
          this.allocatedRooms = res.allocatedRooms;
          this.filteredRooms = this.allocatedRooms;

          if (this.allocatedRooms.length === 0) {
            this.toastr.info("No allocated rooms found!", "Info");
          }
        }
      },
      (err) => {
        console.error('❌ Failed to fetch allocated rooms:', err);
        this.toastr.error('Failed to load allocated rooms!', 'Error');
      }
    );
}

  loadRequestHistory(requestId: any) {
    this.selectedRequest = this.allocatedRooms.find(req => req.request_id === requestId);
    console.log(this.selectedRequest, "selected room request");
    
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
