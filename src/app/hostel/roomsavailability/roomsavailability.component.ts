import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-roomsavailability',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './roomsavailability.component.html',
  styleUrl: './roomsavailability.component.scss'
})
export class RoomsavailabilityComponent implements OnInit {
  roomsList: any[] = []; // ✅ Original data
  filteredRooms: any[] = []; // ✅ Filtered data for search
  searchQuery: string = ''; // ✅ Stores search input

  // ✅ Pagination Variables
  currentPage: number = 1; // Current Page Number
  itemsPerPage: number = 7; // Rooms per page

  constructor(
    private apiSer: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllRooms();
  }

  getAllRooms() {
    this.spinner.show();
    this.apiSer.getAvailableRooms().subscribe(
      (res) => {
        this.roomsList = res.rooms;
        this.filteredRooms = res.rooms; // ✅ Initialize filtered list
        this.spinner.hide();
      },
      () => {
        this.toastr.error('Failed to fetch available rooms!', 'Error');
        this.spinner.hide();
      }
    );
  }

  // ✅ Filtering Function
  filterRooms() {
    this.filteredRooms = this.roomsList.filter(room =>
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
}
