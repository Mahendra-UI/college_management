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

  loadCourses() {
    this.apiService.getCourses().subscribe((response) => {
      this.courses = response;
      console.log("✅ Courses Loaded:", this.courses);
    });
  }

  loadStudentResults() {
    this.spinner.show();
    this.apiService.getStudentResults().subscribe(response => {
        if (response.success) {
          setTimeout(() => {
            this.spinner.hide(); // ✅ Hide Spinner after timeout
          }, 500); // Hide after 1.5s
            this.studentResults = response.results;
            this.filteredStudentResults = response.results; // Initialize filtered list
            console.log("✅ Student Results Loaded:", this.studentResults);
        } else {
          setTimeout(() => {
            this.spinner.hide(); // ✅ Hide Spinner after timeout
          }, 500); // Hide after 1.5s
            console.warn("⚠ No student results found.");
            this.studentResults = [];
        }
    }, error => {
      setTimeout(() => {
        this.spinner.hide(); // ✅ Hide Spinner after timeout
      }, 1500); // Hide after 1.5s
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

  loadStudentsByCourse(courseId: number, callback?: () => void) {
    this.apiService.getStudentsByCourse(courseId).subscribe((response) => {
      this.students = response.success ? response.students : [];
      console.log("✅ Students Loaded for Course:", courseId, this.students);
  
      if (callback) {
        callback();
      }
    });
  }
  

  loadSemesters(callback?: () => void) {
    this.apiService.getSemesters().subscribe((response) => {
      this.semesters = response.success ? response.semesters : [];
      console.log("✅ Semesters Loaded:", this.semesters);
  
      if (callback) {
        callback();
      }
    }, error => {
      console.error("❌ Error Fetching Semesters:", error);
    });
  }
  
  onCourseChange(event: any) {
    const courseId = event.target.value;
  
    // ✅ Clear form values related to student selection
    this.studentResultsForm.patchValue({ 
        full_name: '', // ✅ Clears selected student name
        username: '', 
        semesterId: '', 
        subjectId: '', 
        studentCredits: '' 
    });
  
    // ✅ Clear students and other dropdowns
    this.students = [];
    this.subjects = [];
    this.semesters = [];
  
    console.log("🔄 Course Changed: Resetting students & form controls...");
  
    // ✅ Load students for the new course
    this.loadStudentsByCourse(courseId);
  }
  

  onCourseChangeold(event: any) {
    const courseId = event.target.value;
  
    this.students = [];
    this.subjects = [];
    this.semesters = [];
    this.studentResultsForm.patchValue({ 
        username: '', 
        studentName: '', 
        semesterId: '', 
        subjectId: '', 
        studentCredits: '' 
    });
  
    this.loadStudentsByCourse(courseId);
  }
  

  onStudentChange(selectedStudent: any) {
    if (selectedStudent) {
      console.log("🔹 Selected Student:", selectedStudent);
  
      this.studentResultsForm.patchValue({
        full_name: selectedStudent.full_name, // ✅ Ensure full_name is bound correctly
        username: selectedStudent.username,  // ✅ Ensure username is bound correctly
        courseId: selectedStudent.course_id || '',
        semesterId: '',
        subjectId: '',
        studentCredits: ''
      });
  
      console.log("✅ Updated Form Values:", this.studentResultsForm.value);
  
      this.loadSemesters();
    } else {
      console.warn("⚠ No student selected.");
    }
  }
  

  onStudentChangeold(selectedStudent: any) {
    if (selectedStudent) {
      console.log("🔹 Selected Student:", selectedStudent);
  
      this.studentResultsForm.patchValue({
        full_name: selectedStudent.full_name, // ✅ Ensure full_name is bound correctly
        username: selectedStudent.username,  // ✅ Ensure username is bound correctly
        courseId: selectedStudent.course_id || '',
        semesterId: '',
        subjectId: '',
        studentCredits: ''
      });
  
      console.log("✅ Updated Form Values:", this.studentResultsForm.value);
  
      this.loadSemesters();
    } else {
      console.warn("⚠ No student selected.");
    }
  }
  
  onSemesterChange(event: any) {
    const semesterId = event.target.value;
    const courseId = this.studentResultsForm.value.courseId;
    const username = this.studentResultsForm.value.username;
  
    console.log("📩 Fetching subjects for:", { username, courseId, semesterId });
  
    if (!username || !courseId || !semesterId) {
      console.error("❌ Error: Missing required parameters!", { username, courseId, semesterId });
      return;
    }
  
    this.apiService.getSubjectsByUsernameCourseSemester(username, courseId, semesterId).subscribe(
      (response) => {
        if (response.success) {
          this.subjects = response.subjects;
          console.log("✅ Subjects Loaded:", this.subjects);
        } else {
          console.warn("⚠ No subjects found.");
          this.subjects = [];
        }
      },
      (error) => {
        console.error("❌ Error Fetching Subjects:", error);
      }
    );
  }
  

  onSubjectChange(event: any) {
    const subjectId = event.target.value;
    const selectedSubject = this.subjects.find(sub => sub.subject_id == subjectId);

    if (selectedSubject) {
      this.studentResultsForm.patchValue({
        studentCredits: '' // ✅ Prevent auto-filling credits for new records
      });
      console.log("✅ Selected Subject:", selectedSubject);
    } else {
      console.warn("⚠ No subject found with ID:", subjectId);
    }
  }

  onSubmit() {
    if (this.studentResultsForm.valid) {
      const formData = this.studentResultsForm.value;
      console.log("📩 Submitting Request:", formData); // Debugging log
  
      // ✅ Show Spinner
      this.spinner.show();
  
      if (this.isEditing) {
        // 🛠 UPDATE Student Result
        this.apiService.updateStudentResult(formData).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: '✅ Success!',
                text: 'Result updated successfully!',
                confirmButtonColor: '#28a745',
              });
              this.toastr.success('✅ Result updated successfully!', 'Success');
              this.loadStudentResults();
              this.isEditing = false;
              this.studentResultsForm.reset();
            } else {
              Swal.fire({
                icon: 'warning',
                title: '⚠ Warning!',
                text: 'Something went wrong. Please try again.',
                confirmButtonColor: '#ffc107',
              });
              this.toastr.warning('⚠ Error updating result. Please try again.', 'Warning');
            }
          },
          error => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: '❌ Error!',
              text: error.error?.message || "⚠ Error updating result. Please try again.",
              confirmButtonColor: '#d33',
            });
            this.toastr.error(error.error?.message || "⚠ Error updating result.", 'Error');
          }
        );
      } else {
        // 🛠 ADD NEW Student Result
        console.log("🚀 Calling Add Student Result API..."); // Debugging log
        this.apiService.submitStudentResult(formData).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: '✅ Success!',
                text: 'Result submitted successfully!',
                confirmButtonColor: '#28a745',
              });
              this.toastr.success('✅ Result submitted successfully!', 'Success');
              console.log("🎯 Add API Response:", response);
              this.loadStudentResults();
              this.studentResultsForm.reset();
            }
          },
          error => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: '❌ Error!',
              text: error.error?.message || "⚠ Error submitting result. Please try again.",
              confirmButtonColor: '#d33',
            });
            this.toastr.error(error.error?.message || "⚠ Error submitting result.", 'Error');
          }
        );
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: '⚠ Form Incomplete!',
        text: 'Please fill all required fields before submitting.',
        confirmButtonColor: '#ffc107',
      });
      this.toastr.warning('⚠ Please fill all fields before submitting.', 'Warning');
    }
  }
  


onSubmitold() {
    if (this.studentResultsForm.valid) {
        const formData = this.studentResultsForm.value;

        console.log("📩 Submitting Request:", formData); // Debugging log

        if (this.isEditing) {
            // 🛠 UPDATE Student Result
            this.apiService.updateStudentResult(formData).subscribe(
                response => {
                  if(response.success){
                  setTimeout(() => {
                    this.spinner.hide();
                    this.toastr.success('✅ Result updated successfully!', 'Success');
                  }, 1500);
                    // alert("✅ Result updated successfully!");
                    this.loadStudentResults();
                    this.isEditing = false;
                    this.studentResultsForm.reset();
                  } else {
                    setTimeout(() => {
                      this.spinner.hide();
                      this.toastr.success('✅ Result updated successfully!', 'Success');
                    }, 1500);
                  }
                },
                error => {
                    console.error("❌ Failed to update result:", error);
                    setTimeout(() => {
                      this.spinner.hide();
                      this.toastr.success('⚠ Error updating result. Please try again.', 'Error', error.error?.message);
                    }, 1500);
                    // alert(error.error?.message || "⚠ Error updating result. Please try again.");
                }
            );
        } else {
            // 🛠 ADD NEW Student Result
            console.log("🚀 Calling Add Student Result API..."); // Debugging log
            this.apiService.submitStudentResult(formData).subscribe(
                response => {
                  if(response.success){
                    setTimeout(() => {
                      this.spinner.hide();
                      this.toastr.success('✅ Result submitted successfully!', 'Success');
                    }, 1500);
                    // alert("✅ Result submitted successfully!");
                    console.log("🎯 Add API Response:", response);
                    this.loadStudentResults();
                    this.studentResultsForm.reset();
                  }
                },
                error => {
                    console.error("❌ Failed to submit result:", error);
                    // ✅ Display the exact error message from API
                    alert(error.error?.message || "⚠ Error submitting result. Please try again.");
                }
            );
        }
    } else {
        alert("⚠ Please fill all fields before submitting.");
    }
}


  
  editStudentResult(resultId: number) {
    console.log("📝 Fetching result for editing:", resultId);
  
    this.apiService.getStudentResultById(resultId).subscribe(
      (response) => {
        if (response.success) {
          const result = response.result;
          console.log("✅ Result Data Loaded:", result);
  
          this.isEditing = true;
  
          // ✅ Load students first, then find the correct student
          this.loadStudentsByCourse(result.course_id, () => {
            const selectedStudent = this.students.find(student => student.username === result.username);
            
            if (!selectedStudent) {
              console.warn("⚠ No student found for username:", result.username);
            }
  
            this.studentResultsForm.patchValue({
              courseId: result.course_id,
              username: result.username,
              full_name: selectedStudent ? selectedStudent.full_name : '', // ✅ Ensure full_name is assigned
              semesterId: result.semester_id,
              subjectId: result.subject_id,
              studentCredits: result.credits || '',
              resultStatus: result.result_status
            });
  
            console.log("✅ Updated Form Values:", this.studentResultsForm.value);
  
            // ✅ Load Semesters & Subjects after form update
            this.loadSemesters(() => {
              if (result.course_id && result.semester_id) {
                this.loadSubjects(result.username, result.course_id, result.semester_id);
              }
            });
          });
  
        } else {
          console.warn("⚠ Student result not found.");
        }
      },
      (error) => {
        console.error("❌ Error Fetching Student Result:", error);
      }
    );
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
              this.studentResults = this.studentResults.filter((r) => r.result_id !== resultId);
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
  

  loadSubjects(username: string, courseId: number, semesterId: number) {
    if (!username || !courseId || !semesterId) {
      console.error("❌ Error: Invalid API call with missing parameters", { username, courseId, semesterId });
      return;
    }
  
    console.log(`📩 Fetching subjects for Username: ${username}, Course ID: ${courseId}, Semester ID: ${semesterId}`);
  
    this.apiService.getSubjectsByUsernameCourseSemester(username, courseId, semesterId).subscribe(
      (response) => {
        if (response.success) {
          this.subjects = response.subjects;
          console.log("✅ Subjects Loaded:", this.subjects);
        } else {
          console.warn("⚠ No subjects found.");
          this.subjects = [];
        }
      },
      (error) => {
        console.error("❌ Error Fetching Subjects:", error);
      }
    );
  }
  resetForm() {
    this.studentResultsForm.reset();
    this.isEditing = false;
  }
}
