import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-allocatedrooms',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './allocatedrooms.component.html',
  styleUrl: './allocatedrooms.component.scss'
})
export class AllocatedroomsComponent implements OnInit {
  allocatedRooms: any[] = [];
  selectedRequest: any = null; // Stores selected request for modal
  roomRequests: any[] = []; // Store all room requests

  requestHistory : any[] = [];

  filteredAllocatedRooms: any[] = [];
  searchText: string = '';
  itemsPerPage: number = 50; // Number of records per page
  currentPage: number = 1;
  totalRecords: number = 0;

  constructor(private apiSer: ApiService) {}

  ngOnInit(): void {
    this.fetchAllocatedRooms();
  }

/**
   * Fetch Allocated Rooms Data
   */
fetchAllocatedRooms() {
  this.apiSer.getAllocatedRooms().subscribe(
    (res) => {
      if (res.success) {
        this.allocatedRooms = res.allocatedRooms;
        this.filteredAllocatedRooms = [...this.allocatedRooms]; // Initialize filtered list
        this.totalRecords = this.allocatedRooms.length;
      }
    },
    (err) => console.error('Failed to fetch allocated rooms:', err)
  );
}

/**
 * Search Function - Filters all object properties dynamically
 */
filterAllocatedRooms(): void {
  if (!this.searchText) {
    this.filteredAllocatedRooms = this.allocatedRooms;
  } else {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredAllocatedRooms = this.allocatedRooms.filter(room =>
      Object.values(room).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
  this.currentPage = 1; // Reset pagination to the first page after filtering
}

/**
 * Display count of currently visible records
 */
displayedRecordsCount(): number {
  return Math.min(this.itemsPerPage, this.filteredAllocatedRooms.length - (this.currentPage - 1) * this.itemsPerPage);
}

/**
 * Handle Page Change
 */
onPageChange(event: number) {
  this.currentPage = event;
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
