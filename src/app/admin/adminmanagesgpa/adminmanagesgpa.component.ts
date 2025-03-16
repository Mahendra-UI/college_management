import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminmanagesgpa',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './adminmanagesgpa.component.html',
  styleUrl: './adminmanagesgpa.component.scss'
})
export class AdminmanagesgpaComponent implements OnInit {
  sgpaForm!: FormGroup;
  allStudentsSGPACGPAList: any[] = [];
  selectedStudentId: number | null = null; // ✅ Store student_id

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.sgpaForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      fullName: [{ value: '', disabled: true }],
      firstSemesterSGPA: ['', [Validators.min(0), Validators.max(10)]],
      secondSemesterSGPA: ['', [Validators.min(0), Validators.max(10)]],
      thirdSemesterSGPA: ['', [Validators.min(0), Validators.max(10)]],
      fourthSemesterSGPA: ['', [Validators.min(0), Validators.max(10)]],
      cgpa: ['', [Validators.min(0), Validators.max(10)]] // ✅ Added CGPA field
    });

    this.loadStudentsSGPA();
  }

  // ✅ Open Edit Modal
  openEditModal(username: string) {
    console.log("opened modal");
    
    this.apiSer.getStudentByUsername(username).subscribe({
      next: (response) => {
        if (response.success) {
          const studentData = response.student;
          this.selectedStudentId = studentData.student_id; // ✅ Store student_id

          // ✅ Populate form with student data
          this.sgpaForm.patchValue({
            username: studentData.username,
            fullName: studentData.full_name,
            firstSemesterSGPA: studentData.first_semester_sgpa || '',
            secondSemesterSGPA: studentData.second_semester_sgpa || '',
            thirdSemesterSGPA: studentData.third_semester_sgpa || '',
            fourthSemesterSGPA: studentData.fourth_semester_sgpa || '',
            cgpa: studentData.cgpa || '' // ✅ Include CGPA
          });
        } else {
          console.error("⚠ No student data found.");
        }
      },
      error: (error) => {
        console.error("❌ Error fetching student details:", error);
      }
    });
  }

  // ✅ Update SGPA & CGPA Function
  updateSGPA(): void {
    if (this.sgpaForm.invalid) return;

    const updatedData = {
      student_id: this.selectedStudentId,  // ✅ Include student_id
      first_semester_sgpa: this.sgpaForm.value.firstSemesterSGPA || null,
      second_semester_sgpa: this.sgpaForm.value.secondSemesterSGPA || null,
      third_semester_sgpa: this.sgpaForm.value.thirdSemesterSGPA || null,
      fourth_semester_sgpa: this.sgpaForm.value.fourthSemesterSGPA || null,
      cgpa: this.sgpaForm.value.cgpa || null  // ✅ Now includes CGPA update
    };

    this.spinner.show();

    this.apiSer.updateStudentSGPACGPA(updatedData).subscribe({
      next: (response) => {
        this.spinner.hide();

        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'SGPA & CGPA updated successfully!',
            showConfirmButton: false,
            timer: 2000
          });

          this.toaster.success('SGPA & CGPA updated successfully!', 'Success');
          this.loadStudentsSGPA();
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Update Failed',
            text: 'Failed to update SGPA & CGPA. Please try again.'
          });

          this.toaster.warning('Failed to update SGPA & CGPA. Please try again.', 'Warning');
        }
      },
      error: (error) => {
        this.spinner.hide();

        console.error("❌ Error updating SGPA & CGPA:", error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong while updating SGPA & CGPA.'
        });

        this.toaster.error('Something went wrong while updating SGPA & CGPA.', 'Error');
      }
    });
  }

  // ✅ Load Students with SGPA & CGPA
  loadStudentsSGPA(): void {
    this.spinner.show();
    this.apiSer.getAllStudentsSGPACGPA().subscribe({
      next: (response) => {
        this.allStudentsSGPACGPAList = response.success ? response.students : [];
        this.spinner.hide();
      },
      error: (error) => {
        console.error('❌ Error fetching SGPA & CGPA records:', error);
        this.spinner.hide();
      }
    });
  }
}
