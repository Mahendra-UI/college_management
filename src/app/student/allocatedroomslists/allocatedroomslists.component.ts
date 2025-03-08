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


  // ✅ Handle pagination page change
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
}
