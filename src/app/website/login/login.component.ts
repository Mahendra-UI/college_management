import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    this.loginForm = this.fb.group({
      userType : ['', [Validators.required]],
      userName : ['', [Validators.required]],
      enterPassword : ['', [Validators.required]]
    })
  }
loginFormCtrl(controlName : string) {
  return this.loginForm.get(controlName);
}
onSubmit() {
  if (this.loginForm.valid) {
    if (this.selectedValue === 'Student') {
      this.router.navigate(['/student']);
    } else if (this.selectedValue === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      console.error('Invalid selection. Cannot navigate.');
    }
  } else {
    console.error('Form is invalid.');
  }
}

  // onSubmit() {
  //     if(this.loginForm.valid) {
  //       if(this.selectedValue === 'Student') {
  //       this.router.navigate(['/student'])
  //       }
  //       else if(this.selectedValue === 'Admin') {
  //         this.router.navigate(['/admin'])
  //         }
  //     }
  //   }


  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     if (this.selectedValue === 'Student') {
  //       this.router.navigate(['/student']);
  //     } else if (this.selectedValue === 'Admin') {
  //       this.router.navigate(['/admin']);
  //     }
  //   }
  // }
  

    selectedValue: any;
    selectedDepartment: any;

    // userChange(event : any) {
    //   const userId = event.target.value;
    //   this.selectedValue = userId
    //   console.log(this.selectedValue, 'murali')
    //   if (this.selectedValue === '1') {
    //     this.selectedValue = 'Student';
    //   } else if (this.selectedValue === '2') {
    //     this.selectedValue = 'Admin';
    //   }
    // }

    // userChange(event: any) {
    //   const userId = event.target.value;
    //   if (userId === '1') {
    //     this.selectedValue = 'Student';
    //   } else if (userId === '2') {
    //     this.selectedValue = 'Admin';
    //   } else {
    //     this.selectedValue = null; // Handle invalid cases
    //   }
    //   console.log(this.selectedValue, 'murali');
    // }
    

    userChange(event: any) {
      const userId = event.target.value;
      if (userId === '1') {
        this.selectedValue = 'Student';
      } else if (userId === '2') {
        this.selectedValue = 'Admin';
      } else {
        this.selectedValue = null; // Handle invalid cases
      }
      console.log(`Selected Value: ${this.selectedValue}`);
    }
    

    }