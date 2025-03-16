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
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    this.courseId = Number(sessionStorage.getItem('courseId'));

    // ✅ Fetch student details only if username exists
    if (this.username) {
      this.getStudentDetails(this.username);
    } else {
      console.error('❌ Error: Username is missing in sessionStorage');
    }
  }


/** ✅ Handle Password Change */
onChangePassword() {
  if (this.changePasswordForm.invalid) {
    Swal.fire('Error', 'All fields are required!', 'error');
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

  if (newPassword !== confirmPassword) {
    Swal.fire('Error', 'New password and confirm password do not match!', 'error');
    return;
  }

  if (currentPassword === newPassword) {
    Swal.fire('Error', 'New password must be different from the old password!', 'error');
    return;
  }

  this.apiSer.changePassword(this.username!, currentPassword, newPassword, confirmPassword).subscribe(
    (response) => {
      console.log('✅ Password changed successfully. Clearing session and redirecting to login...');
      
      Swal.fire({
        title: 'Success',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.clear(); // ✅ Clear session storage
        sessionStorage.clear(); // ✅ Ensure full logout
        this.router.navigate(['/login'], { replaceUrl: true }); // ✅ Force redirection
      });
    },
    (error) => {
      console.error('❌ Error changing password:', error);
      Swal.fire('Error', error.error.message || 'Failed to change password', 'error');
    }
  );
  
  

  // this.apiSer.changePassword(this.username!, currentPassword, newPassword, confirmPassword).subscribe(
  //   (response) => {
  //     Swal.fire('Success', response.message, 'success').then(() => {
  //       this.router.navigate(['/login']);    
  //     });
  //   },
  //   (error) => {
  //     Swal.fire('Error', error.error.message || 'Failed to change password', 'error');
  //   }
  // );
}

testRedirect() {
  console.log('🔄 Logging out...');

  sessionStorage.clear(); // ✅ Clear stored session values

  this.router.navigate(['/login'], { replaceUrl: true }); // ✅ Redirect to login
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
