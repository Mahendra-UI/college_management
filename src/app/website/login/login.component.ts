import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import AOS from 'aos';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner'; // ✅ Import Spinner Service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxSpinnerModule], // ✅ Import NgxSpinnerModule
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
    private spinner: NgxSpinnerService // ✅ Inject Spinner Service
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userType: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      enterPassword: ['', [Validators.required]]
    });
  }

  userChange(event: any) {
    const userId = event.target.value;
    this.selectedValue = userId === '1' ? 'Student' : userId === '2' ? 'Admin' : '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
        const userType = this.selectedValue;
        const username = this.loginForm.value.userName;
        const password = this.loginForm.value.enterPassword;

        this.spinner.show(); // ✅ Show spinner before making API call

        this.apiService.login(userType, username, password).subscribe(
            (response: any) => {
                setTimeout(() => {
                    this.spinner.hide(); // ✅ Hide spinner after 1.5s
                }, 1500);
                console.log('Login Response:', response);

                if (response.success) {
                    // ✅ Store values in **sessionStorage** instead of localStorage
                    sessionStorage.setItem('userType', userType);
                    sessionStorage.setItem('username', response.username || username);
                    sessionStorage.setItem('fullName', response.full_name || "Admin");

                    if (response.course_name) {
                        sessionStorage.setItem('course_name', response.course_name);
                    }

                    if (response.courseId) {
                        sessionStorage.setItem('courseId', response.courseId.toString());
                    }

                    setTimeout(() => {
                        this.spinner.hide();
                        this.toastr.success('Login Successful ✅', 'Success');
                        this.redirectUser(userType);
                    }, 1500);
                } else {
                    setTimeout(() => {
                        this.spinner.hide();
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
                console.error('Login failed:', error);
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

  // ✅ Redirect User after Login
  private redirectUser(userType: string) {
    if (userType === 'Student') {
      this.router.navigate(['/student']);
    } else if (userType === 'Admin') {
      this.router.navigate(['/admin']);
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
