import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-allocatedrooms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './allocatedrooms.component.html',
  styleUrl: './allocatedrooms.component.scss'
})
export class AllocatedroomsComponent implements OnInit {
  allocatedRooms: any[] = [];

  constructor(private apiSer: ApiService) {}

  ngOnInit(): void {
    this.fetchAllocatedRooms();
  }

  fetchAllocatedRooms() {
    this.apiSer.getAllocatedRooms().subscribe(
      (res) => {
        if (res.success) {
          this.allocatedRooms = res.allocatedRooms;
        }
      },
      (err) => console.error('Failed to fetch allocated rooms:', err)
    );
  }
}
