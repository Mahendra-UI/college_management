import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var bootstrap: any; // ✅ Add this at the top of your component

@Component({
  selector: 'app-adminmanagecgpa',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './adminmanagecgpa.component.html',
  styleUrl: './adminmanagecgpa.component.scss'
})
export class AdminmanagecgpaComponent implements OnInit {
  cgpaForm!: FormGroup;
  allStudentsCGPAList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.cgpaForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      fullName: [{ value: '', disabled: true }],
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });

    this.loadStudentsCGPA();
  }

  openEditModal(username: string) {
    this.apiSer.getStudentByUsername(username).subscribe({
      next: (response) => {
        if (response.success) {
          const studentData = response.student;
  
          // ✅ Populate the form with student data
          this.cgpaForm.patchValue({
            username: studentData.username,
            fullName: studentData.full_name,
            cgpa: studentData.cgpa // ✅ Editable field
          });
  
          // ✅ No Bootstrap JS modal handling here (Handled by HTML)
        } else {
          console.error("⚠ No student data found.");
        }
      },
      error: (error) => {
        console.error("❌ Error fetching student details:", error);
      }
    });
  }
  
  
  // ✅ Update CGPA Function


updateCGPA(): void {
  if (this.cgpaForm.invalid) return;

  const updatedData = {
    username: this.cgpaForm.getRawValue().username,
    cgpa: this.cgpaForm.value.cgpa
  };

  this.spinner.show();

  this.apiSer.updateStudentCgpa(updatedData).subscribe({
    next: (response) => {
      this.spinner.hide();

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'CGPA updated successfully!',
          showConfirmButton: false,
          timer: 2000
        });

        this.toaster.success('CGPA updated successfully!', 'Success');

        this.loadStudentsCGPA(); 

        // ✅ Close Bootstrap 5 modal after success
        const modalElement = document.getElementById('cgpaModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement); // ✅ Bootstrap instance fix
          modal?.hide();
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Update Failed',
          text: 'Failed to update CGPA. Please try again.'
        });

        this.toaster.warning('Failed to update CGPA. Please try again.', 'Warning');
      }
    },
    error: (error) => {
      this.spinner.hide();

      console.error("❌ Error updating CGPA:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while updating CGPA.'
      });

      this.toaster.error('Something went wrong while updating CGPA.', 'Error');
    }
  });

}
  // Load Students with CGPA
  loadStudentsCGPA(): void {
    this.spinner.show();
    this.apiSer.getAllStudentsCGPA().subscribe({
      next: (response) => {
        this.allStudentsCGPAList = response.success ? response.students : [];
        this.spinner.hide();
      },
      error: (error) => {
        console.error('❌ Error fetching CGPA records:', error);
        this.spinner.hide();
      }
    });
  }
}
