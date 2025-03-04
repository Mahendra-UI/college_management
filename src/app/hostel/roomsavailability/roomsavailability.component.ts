import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roomsavailability',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './roomsavailability.component.html',
  styleUrl: './roomsavailability.component.scss'
})
export class RoomsavailabilityComponent implements OnInit {
  roomsList: any[] = [];
  searchTerm: string = '';

  constructor(
    private apiSer: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAvailableRooms();
  }

  getAvailableRooms() {
    this.spinner.show();
    this.apiSer.getAvailableRooms().subscribe(
      (res) => {
        this.roomsList = res.rooms;
        this.spinner.hide();
      },
      () => {
        this.toastr.error('Failed to fetch available rooms!', 'Error');
        this.spinner.hide();
      }
    );
  }

  filteredRooms() {
    if (!this.searchTerm) return this.roomsList;
    return this.roomsList.filter(room =>
      Object.values(room).some(value =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }
}
