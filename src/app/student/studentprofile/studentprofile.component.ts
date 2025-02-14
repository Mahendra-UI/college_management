import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-studentprofile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})
export class StudentprofileComponent implements OnInit {
  username: string | null = null;
  courseId: number | null = null;
  studentDetails: any = {}; // ✅ Store as an object instead of an array

  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    // ✅ Retrieve values from sessionStorage instead of localStorage
    this.username = sessionStorage.getItem('username');
    this.courseId = Number(sessionStorage.getItem('courseId'));

    // ✅ Fetch student details only if username exists
    if (this.username) {
      this.getStudentDetails(this.username);
    } else {
      console.error('❌ Error: Username is missing in sessionStorage');
    }
  }

  /** ✅ Fetch Student Details by Username */
  getStudentDetails(username: string): void {
    this.spinner.show();
    this.apiSer.getStudentByUsername(username).subscribe(
      (response) => {
        if (response) {
          setTimeout(() => {
            this.spinner.hide(); // ✅ Hide Spinner after timeout
          }, 500); // Hide after 1.5s
          this.studentDetails = response.student; // ✅ Directly assign object
          console.log("✅ Student Details:", this.studentDetails);
        } else {
          console.warn('⚠ No student data found');
          this.studentDetails = {};
        }
      },
      (error) => {
        console.error('❌ Error fetching student details', error);
        this.studentDetails = {}; // Reset in case of an error
      }
    );
  }
}
