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
  itemsPerPage = 7;

  constructor(private toastr: ToastrService, private apiSer: ApiService) {}

  ngOnInit(): void {
    // ✅ Load username from sessionStorage
    this.selectedUsername = sessionStorage.getItem('username');
    
    // ✅ Fetch allocated rooms on load
    this.fetchAllocatedRooms();
  }

  fetchAllocatedRooms() {
    this.apiSer.getAllocatedRooms().subscribe(
      (res) => {
        if (res.success) {
          this.allocatedRooms = res.allocatedRooms;
          this.filterRooms(); // ✅ Automatically filter rooms
        }
      },
      (err) => {
        console.error('❌ Failed to fetch allocated rooms:', err);
        this.toastr.error('Failed to load allocated rooms!', 'Error');
      }
    );
  }

  // ✅ Filter rooms based on the stored username
  filterRooms() {
    if (!this.selectedUsername) {
      this.filteredRooms = this.allocatedRooms; // Show all if no username in sessionStorage
    } else {
      this.filteredRooms = this.allocatedRooms.filter(room =>
        room.username.toLowerCase() === this.selectedUsername?.toLowerCase()
      );
    }
  }

  // ✅ Handle pagination page change
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
}
