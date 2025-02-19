import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-studentprofile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})
export class StudentprofileComponent implements OnInit {

  changePasswordForm!: FormGroup;

  username: string | null = null;
  courseId: number | null = null;
  studentDetails: any = {}; // ✅ Store as an object instead of an array

  constructor(private router: Router, private fb: FormBuilder, private apiSer: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    // ✅ Retrieve values from sessionStorage instead of localStorage
    this.username = sessionStorage.getItem('username');


    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.courseId = Number(sessionStorage.getItem('courseId'));

    // ✅ Fetch student details only if username exists
    if (this.username) {
      this.getStudentDetails(this.username);
    } else {
      console.error('❌ Error: Username is missing in sessionStorage');
    }
  }


  onSubmit() {
    if (this.changePasswordForm.valid && this.username) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.apiSer.changePassword(this.username, currentPassword, newPassword).subscribe(
        (response) => {
          Swal.fire('✅ Success', response.message, 'success').then(() => {
            sessionStorage.clear(); // ✅ Clear session & redirect to login
            this.router.navigate(['/login']);
          });
        },
        (error) => {
          Swal.fire('❌ Error', error.error.message || 'Something went wrong!', 'error');
        }
      );
    } else {
      Swal.fire('⚠️ Warning', 'All fields are required!', 'warning');
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
