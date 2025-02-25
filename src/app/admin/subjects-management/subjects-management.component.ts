import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-subjects-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './subjects-management.component.html',
  styleUrl: './subjects-management.component.scss'
})
export class SubjectsManagementComponent implements OnInit {

  filteredSubjects: any[] = []; // Filtered Data for Search
  searchText: string = ''; // Search text
  itemsPerPage: number = 5; 
  currentPage: number = 1; 

  /**
   * Search Function - Filters dynamically across all object properties
   * ✅ Resets `currentPage` to `1` to fix pagination issue
   */
  filterSubjects(): void {
    if (!this.searchText) {
      this.filteredSubjects = this.subjectsList;
    } else {
      const searchTerm = this.searchText.toLowerCase();
      this.filteredSubjects = this.subjectsList.filter(subject =>
        Object.values(subject).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }
    
    this.currentPage = 1; // ✅ Reset pagination when searching
  }

  /**
   * Display count of currently visible records
   */
  displayedRecordsCount(): number {
    return Math.min(this.itemsPerPage, this.filteredSubjects.length - (this.currentPage - 1) * this.itemsPerPage);
  }
/**
 * Handle Page Change
 */
onPageChange(event: number) {
  this.currentPage = event;
}

  subjectForm!: FormGroup;
  subjectsList: any[] = [];
  coursesList: any[] = [];
  semestersList: any[] = [];
  selectedCourseId: number = 0;
  selectedSemesterId: number = 0;
  editingSubjectId: number | null = null;
  subjectDetails: any = null;


  constructor(private apiService: ApiService, private fb: FormBuilder, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCourses();
    // this.loadSemesters();
    this.loadSubjects();
     // ✅ Listen for any form changes
  this.subjectForm.valueChanges.subscribe(() => {
    this.subjectForm.markAsDirty(); // ✅ Mark form as dirty on change
  });
  }

  /** ✅ Initialize Form with Validations */
  initializeForm() {
    this.subjectForm = this.fb.group({
      courseId: ['', Validators.required],
      semesterId: ['', Validators.required],
      subjectName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      subjectCredits: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  /** ✅ Utility Function to Retrieve Form Controls */
  getSubjectFormCtrl(controlName: string) {
    return this.subjectForm.get(controlName);
  }

  /** ✅ Load Courses */
  loadCourses() {
    this.apiService.getCourses().subscribe(
      (res: any) => {
        if (res?.success && Array.isArray(res.courses)) {
          this.coursesList = res.courses; // ✅ Assign only the `courses` array
        } else {
          console.warn('⚠ No courses found.');
          this.coursesList = [];
        }
        console.log("✅ Loaded Courses:", this.coursesList);
      },
      (error) => {
        console.error("❌ Error fetching courses:", error);
        this.coursesList = []; // Ensure list is empty on error
      }
    );
  }
  



  /** ✅ Load Subjects */
  loadSubjects() {
    this.spinner.show();
    console.log(`📡 Fetching subjects for Course ID: ${this.selectedCourseId}, Semester ID: ${this.selectedSemesterId}`);

    this.apiService.getSubjects(Number(this.selectedCourseId), Number(this.selectedSemesterId)).subscribe(
      (data: any) => {
        setTimeout(() => {
          this.spinner.hide(); // ✅ Hide Spinner after timeout
        }, 500); // Hide after 1.5s

        console.log("✅ Subjects List:", data.subjects);
        this.subjectsList = data.subjects;
        this.filteredSubjects = data.subjects;
      },
      (error) => {
        this.spinner.hide();
        console.error("❌ Error fetching subjects:", error);
      }
    );
}


  /** ✅ Handle Course Change */
  onCourseChange(event: any) {
    this.loadSemesters();
    this.selectedCourseId = +event.target.value || 0;
    console.log(`✅ Course Selected: ${this.selectedCourseId}`);

    // if (this.selectedCourseId) {
    //   this.loadSubjects();
    // }

    // if (this.selectedCourseId > 0) {
    //   this.loadSubjects();
    // }
  }

  /** ✅ Handle Semester Change */
  onSemesterChange(event: any) {
    this.selectedSemesterId = +event.target.value || 0;
    console.log(`✅ Semester Selected: ${this.selectedSemesterId}`);
    // if (this.selectedCourseId > 0) {
    //   this.loadSubjects();
    // }
  }

/** ✅ Add or Update Subject */

onSubmit() {
  if (this.subjectForm.valid) {
    let subjectData = {
      subjectId: this.editingSubjectId || this.subjectForm.value.subjectId, 
      courseId: this.subjectForm.value.courseId,
      semesterId: this.subjectForm.value.semesterId,
      subjectName: this.subjectForm.value.subjectName,
      subjectCredits: Number(this.subjectForm.value.subjectCredits), // ✅ Ensure it's a number
      subjectCode: this.editingSubjectId 
        ? this.subjectForm.value.subjectCode 
        : `SUB-${this.subjectForm.value.courseId}-${this.subjectForm.value.semesterId}-${Date.now().toString().slice(-5)}`, 
    };

    if (isNaN(subjectData.subjectCredits) || subjectData.subjectCredits <= 0) {
      Swal.fire("❌ Error", "Invalid subject credits", "error");
      return;
    }

    console.log("🛠️ Preparing to submit:", subjectData);

    if (this.editingSubjectId) {
      this.apiService.updateSubject(this.editingSubjectId, subjectData).subscribe(
        (response) => {
          Swal.fire("✅ Success", "Subject Updated", "success");
          this.loadSubjects();
          this.resetForm();
        },
        (error) => {
          console.error("❌ API Error (Update):", error);
          Swal.fire("❌ Error", "Failed to update subject. Please try again.", "error");
        }
      );
    } else {
      this.apiService.addSubject(subjectData).subscribe(
        (response) => {
          Swal.fire("✅ Success", "Subject Added", "success");
          this.loadSubjects();
          this.resetForm();
        },
        (error) => {
          console.error("❌ API Error (Add):", error);
          Swal.fire("❌ Error", "Failed to add subject. Please try again.", "error");
        }
      );
    }
  } else {
    console.error("❌ Form Invalid. Cannot Submit");
    Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly.", "warning");
  }
}




  /** ✅ Edit Subject */
  onEdit(subjectId: number) {
    console.log("✏️ Fetching Subject:", subjectId);
  
    this.apiService.getSubjectById(subjectId).subscribe(
      (response) => {
        if (response.success) {
          const subject = response.subject;
          this.editingSubjectId = subject.subject_id; // ✅ Keep subject_id unchanged

          this.loadSemesters(() => {
            this.subjectForm.patchValue({
              subjectId: subject.subject_id,
              courseId: subject.course_id,
              semesterId: subject.semester_id,
              subjectName: subject.subject_name,
              subjectCredits: parseFloat(subject.subject_credits), // ✅ Ensure numeric value
              subjectCode: subject.subject_code, // ✅ Keep the same subjectCode
            });

            this.subjectForm.markAsTouched();
            this.subjectForm.markAsDirty();

            console.log("✅ Subject Data Bound to Form:", this.subjectForm.value);
          });

        } else {
          console.error("❌ Subject not found");
        }
      },
      (error) => {
        console.error("❌ API Error fetching subject:", error);
        Swal.fire("❌ Error", "Failed to fetch subject details.", "error");
      }
    );
}
  
  
  loadSemesters(callback?: () => void) {
    this.apiService.getSemesters().subscribe(
      (data) => {
        this.semestersList = data.semesters;
        console.log("✅ Semesters List:", this.semestersList);
  
        if (callback) {
          callback(); // Execute the callback function after loading semesters
        }
      },
      (error) => console.error('❌ Error fetching semesters', error)
    );
  }
  


  /** ✅ Reset Form */
  resetForm() {
    this.subjectForm.reset();
    this.subjectForm.patchValue({ subjectCredits: 1 });
    this.editingSubjectId = null;
  }

  getSubjectDetails(subjectId: any): void {
    console.log("✏️ Fetching Subject:", subjectId);
  
    this.apiService.getSubjectById(subjectId).subscribe(
      (response) => {
        console.log("📡 API Response:", response);
        if (response.success) {
          this.subjectDetails = response.subject;
          // Swal.fire({
          //   title: "📚 Subject Details",
          //   html: `
          //     <p><strong>Subject Name:</strong> ${this.subjectDetails.subject_name}</p>
          //     <p><strong>Course:</strong> ${this.subjectDetails.course_name}</p>
          //     <p><strong>Semester:</strong> ${this.subjectDetails.semester_name}</p>
          //     <p><strong>Credits:</strong> ${this.subjectDetails.subject_credits}</p>
          //   `,
          //   icon: "info"
          // });
          console.log("✅ Subject Details:", this.subjectDetails);
        } else {
          console.error("❌ Subject not found");
          Swal.fire("⚠ No Data", "Subject details not found.", "warning");
        }
      },
      (error) => {
        console.error('❌ Error fetching subject details:', error);
        Swal.fire("❌ Error", "Failed to fetch subject details.", "error");
      }
    );
  }

  deleteSubject(subjectId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subject!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteSubject(subjectId).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire('Deleted!', 'Subject has been deleted.', 'success');
              this.subjectsList = this.subjectsList.filter((s) => s.subject_id !== subjectId);
            } else {
              Swal.fire('Error!', response.message, 'error');
            }
          },
          (error) => {
            console.error("❌ Error deleting subject:", error);
            Swal.fire('Error!', 'Failed to delete subject.', 'error');
          }
        );
      }
    });
  }


}
