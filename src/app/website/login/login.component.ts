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
      this.router.navigate(['/home']); // ✅ Redirect logged-in users away from login page
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
            sessionStorage.setItem('userType', userType);
            sessionStorage.setItem('username', response.username || username);
  
            if (response.full_name) {
              sessionStorage.setItem('fullName', response.full_name);
            } else {
              sessionStorage.setItem('fullName', "User");
            }
  
            if (userType === 'Student') {
              if (response.course_name) {
                sessionStorage.setItem('course_name', response.course_name);
              } else {
                sessionStorage.removeItem('course_name');
              }
  
              if (response.courseId) {
                sessionStorage.setItem('courseId', response.courseId.toString());
              } else {
                sessionStorage.removeItem('courseId');
              }
            } else {
              sessionStorage.removeItem('course_name');
              sessionStorage.removeItem('courseId');
              sessionStorage.setItem('email', response.email || '');
              sessionStorage.setItem('mobile', response.mobile || '');
            }
  
            setTimeout(() => {
              this.toastr.success('Login Successful ✅', 'Success');
              this.redirectUser(userType);
            }, 1500);
          } else {
            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Login Failed ❌',
                text: response.message || "Invalid credentials!",
                confirmButtonColor: '#d33',
              });
            }, 1000);
          }
        },
        (error) => {
          setTimeout(() => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'Invalid Credentials ❌',
              text: 'Please check your username and password!',
              confirmButtonColor: '#d33',
            });
          }, 1000);
        }
      );
    } else {
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

  loginFormCtrl(controlName: any) {
    return this.loginForm.get(controlName);
  }

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
