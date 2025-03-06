import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import AOS from 'aos';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  selectedValue: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      this.router.navigate(['/student']); // ✅ Redirect logged-in users away from login page
    }

    // ✅ Prevent Back Navigation
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.pushState(null, '', location.href);
    };

    this.loginForm = this.fb.group({
      userType: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      enterPassword: ['', [Validators.required]]
    });
  }

  /** ✅ Handle user role selection */
  userChange(event: any) {
    const userId = event.target.value;
    if (userId === '1') {
      this.selectedValue = 'Student';
    } else if (userId === '2') {
      this.selectedValue = 'Admin';
    } else if (userId === '3') {
      this.selectedValue = 'Hostel Admin';
    } else {
      this.selectedValue = '';
    }
  }

  /** ✅ Submit Login Form */

/** ✅ Submit Login Form */
onSubmit() {
  if (this.loginForm.valid) {
      const userType = this.selectedValue;
      const username = this.loginForm.value.userName;
      const password = this.loginForm.value.enterPassword;

      this.spinner.show();

      this.apiService.login(userType, username, password).subscribe(
          (response: any) => {
              setTimeout(() => {
                  this.spinner.hide();
              }, 1500);

              if (response.success) {
                  // ✅ Store user details in sessionStorage
                  sessionStorage.setItem('userType', userType);
                  sessionStorage.setItem('username', response.username || username);
                  sessionStorage.setItem('fullName', response.full_name || "User");

                  // ✅ Ensure student_id is stored for Student users
                  if (userType === 'Student') {
                      sessionStorage.setItem('student_id', response.student_id?.toString() || '');
                      sessionStorage.setItem('course_name', response.course_name || '');
                      sessionStorage.setItem('courseId', response.courseId?.toString() || '');
                      sessionStorage.setItem('academic_course_year_id', response.academic_course_year_id?.toString() || '');
                      sessionStorage.setItem('academic_course_year_name', response.academic_course_year_name || '');
                  } else {
                      // ✅ Remove Student-specific data for non-students
                      sessionStorage.removeItem('student_id');
                      sessionStorage.removeItem('course_name');
                      sessionStorage.removeItem('courseId');
                      sessionStorage.removeItem('academic_course_year_id');
                      sessionStorage.removeItem('academic_course_year_name');

                      // ✅ Store email & mobile for Admin/Hostel Admin users
                      sessionStorage.setItem('email', response.email || '');
                      sessionStorage.setItem('mobile', response.mobile || '');
                  }

                  setTimeout(() => {
                      this.toastr.success('Login Successful ✅', 'Success');
                      this.redirectUser(userType);
                  }, 1500);
              } else {
                  // ✅ Show error message if login fails
                  this.showError(response.message || "Invalid credentials!");
              }
          },
          (error) => {
              this.spinner.hide();
              console.error("❌ Login API Error:", error);
              this.showError("Please check your username and password!");
          }
      );
  } else {
      // ✅ Alert for incomplete form fields
      Swal.fire({
          icon: 'warning',
          title: '⚠ Fill all fields!',
          text: 'Please enter all required details.',
          confirmButtonColor: '#f39c12',
      });
  }
}


  /** ✅ Redirect User after Login */
  private redirectUser(userType: string) {
    if (userType === 'Student') {
      this.router.navigate(['/student']);
    } else if (userType === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (userType === 'Hostel Admin') {
      this.router.navigate(['/hostel']);
    }
  }

  /** ✅ Show Error */
  private showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed ❌',
      text: message,
      confirmButtonColor: '#d33',
    });
  }

  /** ✅ Get Form Control */
  loginFormCtrl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  /** ✅ Initialize Animations */
  ngAfterViewInit(): void {
    console.log("Initializing AOS...");
    AOS.init({
      duration: 1000,
      once: true,
    });

    setTimeout(() => {
      console.log("Refreshing AOS...");
      AOS.refresh();
    }, 500);
  }
}
