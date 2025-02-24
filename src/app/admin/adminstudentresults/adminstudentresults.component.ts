import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgSelectModule} from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-adminstudentresults',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgxPaginationModule],
  templateUrl: './adminstudentresults.component.html',
  styleUrl: './adminstudentresults.component.scss'
})
export class AdminstudentresultsComponent implements OnInit {


  filteredStudentResults: any[] = []; // Filtered Data for Search
  searchText: string = ''; 
  itemsPerPage: number = 5;
  currentPage: number = 1;


  studentResultsForm!: FormGroup;
  studentResults: any[] = [];
  students: any[] = [];
  semesters: any[] = [];
  subjects: any[] = [];
  courses: any[] = [];
  isEditing: boolean = false; // ✅ Track whether updating or adding new record
  selectedStudentResult: any = null; // ✅ To display selected student result


  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.studentResultsForm = this.fb.group({
      courseId: ['', Validators.required],
      full_name: ['', Validators.required], // ✅ Changed for "Select Student Name"
      username: ['', Validators.required], // ✅ Changed for "Student Username"
      semesterId: ['', Validators.required],
      subjectId: ['', Validators.required],
      studentCredits: [''], // No auto-fill for new records
      resultStatus: ['', Validators.required]
    });

    this.loadCourses();
    this.loadStudentResults();
  }

 // ✅ Load Courses
 loadCourses(): void {
  this.apiService.getCourses().subscribe(
    (response) => {
      if (response.success && response.courses) {
        this.courses = response.courses; // ✅ Assign only the `courses` array
      } else {
        console.warn('⚠ No courses found.');
        this.courses = [];
      }
    },
    (error) => {
      console.error('❌ Error fetching courses:', error);
      this.courses = []; // Ensure list is empty on error
    }
  );
}


  // ✅ Load Student Results
  loadStudentResults() {
    this.spinner.show();
    this.apiService.getStudentResults().subscribe(response => {
      this.spinner.hide();
      this.studentResults = response.success ? response.results : [];
      this.filteredStudentResults = this.studentResults;
    }, error => {
      this.spinner.hide();
      console.error("❌ Error Fetching Student Results:", error);
    });
  }

/**
   * Search Function - Filters dynamically across all object properties
   */
filterStudentResults(): void {
  if (!this.searchText) {
    this.filteredStudentResults = this.studentResults;
    return;
  }
  
  const searchTerm = this.searchText.toLowerCase();
  this.filteredStudentResults = this.studentResults.filter(result =>
    Object.values(result).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm)
    )
  );
}

/**
 * Display count of currently visible records
 */
displayedRecordsCount(): number {
  return Math.min(this.itemsPerPage, this.filteredStudentResults.length - (this.currentPage - 1) * this.itemsPerPage);
}

/**
 * Handle Page Change
 */
onPageChange(event: number) {
  this.currentPage = event;
}

  // ✅ Load Students by Course
  loadStudentsByCourse(courseId: number) {
    this.apiService.getStudentsByCourse(courseId).subscribe(response => {
      this.students = response.success ? response.students : [];
    });
  }

  

// ✅ Load Semesters
loadSemesters() {
  this.apiService.getSemesters().subscribe(response => {
    this.semesters = response.success ? response.semesters : [];
  });
}
  
 // ✅ Handle Course Change
 onCourseChange(event: any) {
  const courseId = event.target.value;
  this.studentResultsForm.patchValue({ full_name: '', username: '', semesterId: '', subjectId: '', studentCredits: '' });
  this.students = [];
  this.semesters = [];
  this.subjects = [];

  if (courseId) {
    this.loadStudentsByCourse(courseId);
  }
}
  
  

  // ✅ Handle Student Change
  onStudentChange(selectedStudent: any) {
    if (selectedStudent) {
      this.studentResultsForm.patchValue({
        username: selectedStudent.username,
        semesterId: '',
        subjectId: '',
        studentCredits: ''
      });

      this.semesters = [];
      this.subjects = [];
      this.loadSemesters();
    }
  }
  
 // ✅ Handle Semester Change
 onSemesterChange(event: any) {
  const semesterId = event.target.value;
  const courseId = this.studentResultsForm.value.courseId;
  const username = this.studentResultsForm.value.username;

  this.studentResultsForm.patchValue({ subjectId: '', studentCredits: '' });
  this.subjects = [];

  if (username && courseId && semesterId) {
    this.loadSubjects(username, courseId, semesterId);
  }
}
  
// ✅ Subject Change Handler
  // ✅ Handle Subject Change
  onSubjectChange(event: any) {
    this.studentResultsForm.patchValue({ studentCredits: '' });
  }

// ✅ Submit Form

// ✅ Handle Submit / Update

onSubmit() {
  if (this.studentResultsForm.valid) {
    const formData = this.studentResultsForm.value;
    this.spinner.show();

    if (this.isEditing) {
      this.apiService.updateStudentResult(formData).subscribe(
        response => {
          this.spinner.hide();
          Swal.fire('✅ Success!', 'Result updated successfully!', 'success');
          this.toastr.success('✅ Result updated successfully!', 'Success');
          this.loadStudentResults();
          this.isEditing = false;
          this.studentResultsForm.reset();
        },
        error => {
          this.spinner.hide();  
          Swal.fire('❌ Error!', error.error?.message || "⚠ Error updating result.", 'error');
          this.toastr.error(error.error?.message || "⚠ Error updating result.", 'Error');
        }
      );
    } else {
      this.apiService.submitStudentResult(formData).subscribe(
        response => {
          this.spinner.hide();
          Swal.fire('✅ Success!', 'Result submitted successfully!', 'success');
          this.toastr.success('✅ Result submitted successfully!', 'Success');
          this.loadStudentResults();
          this.studentResultsForm.reset();
        },
        error => {
          this.spinner.hide();
          Swal.fire('❌ Error!', error.error?.message || "⚠ Student result already exists.", 'error');
          this.toastr.error(error.error?.message || "⚠ Student result already exists.", 'Error');
        }
      );
    }
  } else {
    Swal.fire('⚠ Form Incomplete!', 'Please fill all required fields before submitting.', 'warning');
  }
}

editStudentResult(resultId: number) {
  this.isEditing = true;
  this.apiService.getStudentResultById(resultId).subscribe(response => {
    if (response.success) {
      const result = response.result;
      this.studentResultsForm.patchValue({
        courseId: result.course_id,
        username: result.username,
        full_name: result.full_name,
        semesterId: result.semester_id,
        subjectId: result.subject_id,
        studentCredits: result.earned_credits || '',
        resultStatus: result.result_status
      });

      this.loadStudentsByCourse(result.course_id);
      this.loadSemesters();
      this.loadSubjects(result.username, result.course_id, result.semester_id);
    }
  });
}



  
  viewStudentResult(resultId: number) {
    console.log("🔍 Fetching Student Result:", resultId);
    
    this.apiService.getStudentResultById(resultId).subscribe(
      (response) => {
        if (response.success) {
          this.selectedStudentResult = response.result; // ✅ Bind response to modal
          console.log("✅ Student Result Loaded:", this.selectedStudentResult);
        } else {
          console.warn("⚠ Student result not found.");
          this.selectedStudentResult = null;
        }
      },
      (error) => {
        console.error("❌ Error Fetching Student Result:", error);
        this.selectedStudentResult = null;
      }
    );
  }
  
  deleteStudentResult(resultId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this result!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Confirm!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteStudentResult(resultId).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire('Deleted!', 'Student result has been deleted.', 'success');
              
              // ✅ Reload student results from API after deletion
              this.loadStudentResults();
            } else {
              Swal.fire('Error!', response.message, 'error');
            }
          },
          (error) => {
            console.error("❌ Error deleting student result:", error);
            Swal.fire('Error!', 'Failed to delete student result.', 'error');
          }
        );
      }
    });
  }
  
  

 // ✅ Load Subjects
 loadSubjects(username: string, courseId: number, semesterId: number) {
  this.apiService.getSubjectsByUsernameCourseSemester(username, courseId, semesterId).subscribe(response => {
    this.subjects = response.success ? response.subjects : [];
  });
}
  resetForm() {
    this.studentResultsForm.reset();
    this.isEditing = false;
    this.students = []; // ✅ Clear students list
    this.semesters = [];
    this.subjects = [];
  }
  
}
