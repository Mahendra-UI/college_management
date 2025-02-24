import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-managestudents',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule], // ✅ Import NgxPaginationModule
  templateUrl: './managestudents.component.html',
  styleUrl: './managestudents.component.scss'
})
export class ManagestudentsComponent implements OnInit {

  filteredStudents: any[] = []; // Filtered Data for Search
  searchText: string = ''; 
  itemsPerPage: number = 50;
  currentPage: number = 1;

  isSubmitting: boolean = false; // ✅ FIXED Missing Variable
  isCheckingDuplicate : boolean = false;


  academicCourseYearsList: any[] = []; // ✅ New list for course years


  promotionHistory: any[] = [];
  studentsList: any[] = [];
  coursesList: any[] = [];
  studentForm!: FormGroup;
  message: string = '';
  studentDetails: any = null;
  studentId: number = 0; // Default student ID
  yearsList: number[] = []; // Dynamic year list


  studentUsername: string = '';  // ✅ Define studentUsername
  courseId: number = 0;          // ✅ Define courseId
  subjectsList: any[] = []; 


  constructor(private apiSer: ApiService, private fb: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
// ✅ Populate Year Dropdown (Last 10 Years)
this.loadYears();
this.initializeForm();
this.loadStudents();
this.loadCourses();
this.loadAcademicCourseYears(); // ✅ Load academic course years
  }

/**
   * ✅ Initialize Form with Validations
   */

initializeForm() {
  this.studentForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    fatherName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    emailID: ['', [Validators.required, Validators.email]],
    studentGender: ['', Validators.required],
    studentDateOfBirth: ['', Validators.required],
    courseId: ['', Validators.required],
    academicCourseYearId: ['', Validators.required],
    studentEnrollmentDate: ['', Validators.required], // ✅ Updated to store date instead of year
    studentAddress: ['', Validators.required],
    studentStatus: ['', Validators.required]
  });
}
 

/**
   * ✅ Load academic course years
   */
loadAcademicCourseYears(): void {
  this.apiSer.getAcademicCourseYears().subscribe(
    (res: any) => {
      if (res.success && res.academicYears) {
        // ✅ Filter out "Course Completed" (academic_course_year_id = 5)
        this.academicCourseYearsList = res.academicYears.filter(
          (year: any) => year.academic_course_year_id !== 5
        );
        console.log("✅ Loaded Academic Course Years (Excluding Course Completed):", this.academicCourseYearsList);
      } else {
        this.academicCourseYearsList = [];
        console.error("❌ Failed to load academic course years: No data found");
      }
    },
    (error) => {
      this.academicCourseYearsList = [];
      console.error("❌ Error fetching academic course years:", error);
    }
  );
}




loadYears(): void {
    const currentYear = new Date().getFullYear();
    this.yearsList = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

/**
 * Load all students
 */
loadStudents(): void {
  this.spinner.show();
  this.apiSer.getStudents(0).subscribe(
    (data) => {
      setTimeout(() => {
        this.spinner.hide(); // ✅ Hide Spinner after timeout
      }, 500); // Hide after 1.5s
      this.studentsList = data.students;
      console.log(this.studentsList, "students list new issue");
      
      this.filteredStudents = data.students; // Initialize filtered list
    },
    (error) => {
      this.spinner.hide();
      console.error('Error fetching students', error);
    }
  );
}

/**
   * Search Function - Filters all object properties dynamically
   */
filterStudents(): void {
  if (!this.searchText) {
    this.filteredStudents = this.studentsList;
  }
  else {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredStudents = this.studentsList.filter(student =>
      Object.values(student).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
  this.currentPage = 1;
}

/**
 * Display count of currently visible records
 */
displayedRecordsCount(): number {
  return Math.min(this.itemsPerPage, this.filteredStudents.length - (this.currentPage - 1) * this.itemsPerPage);
}

/**
 * Handle Page Change
 */
onPageChange(event: number) {
  this.currentPage = event;
}

  /**
   * Load courses
   */
  loadCourses(): void {
    this.apiSer.getCourses().subscribe(
      (response) => {
        if (response.success && response.courses) {
          this.coursesList = response.courses; // ✅ Assign only the `courses` array
        } else {
          console.warn('⚠ No courses found.');
          this.coursesList = [];
        }
      },
      (error) => {
        console.error('❌ Error fetching courses:', error);
        this.coursesList = []; // Ensure list is empty on error
      }
    );
  }
  

/**
   * ✅ Insert or Update Student
   */

/**
   * ✅ Submit the form for Insert/Update
   */

onSubmit() {
  if (this.studentForm.valid) {
    this.isSubmitting = true;

    const studentData = {
      student_id: this.studentId,
      full_name: this.studentForm.value.fullName,
      father_name: this.studentForm.value.fatherName,
      mobile_no: this.studentForm.value.mobileNo,
      email_id: this.studentForm.value.emailID,
      student_gender: this.studentForm.value.studentGender,
      student_date_of_birth: this.studentForm.value.studentDateOfBirth,
      course_id: this.studentForm.value.courseId,  // ✅ Now passing `course_id`
      academic_course_year_id: this.studentForm.value.academicCourseYearId,
      student_enrollment_date: this.studentForm.value.studentEnrollmentDate,
      student_address: this.studentForm.value.studentAddress,
      student_status: this.studentForm.value.studentStatus
    };

    if (this.studentId && this.studentId !== 0) {
      this.apiSer.updateStudent(studentData).subscribe(
        () => {
          Swal.fire('✅ Success', 'Student Updated Successfully', 'success');
          this.loadStudents();
          this.resetForm();
        },
        (error) => {
          Swal.fire('❌ API Error', error.message, 'error');
        }
      );
    } else {
      this.apiSer.saveStudent(studentData).subscribe(
        () => {
          Swal.fire('✅ Success', 'Student Inserted Successfully', 'success');
          this.loadStudents();
          this.resetForm();
        },
        (error) => {
          Swal.fire('❌ API Error', error.message, 'error');
        }
      );
    }
  } else {
    Swal.fire('❌ Invalid Form', 'Please fill in all required fields correctly', 'warning');
  }
}





editStudent(student: any): void {
  const selectedCourse = this.coursesList.find(course => course.course_name === student.course_name);
  const selectedCourseYear = this.academicCourseYearsList.find(year => year.academic_course_year_name === student.academic_course_year_name);

  this.studentForm.patchValue({
    fullName: student.full_name,
    fatherName: student.father_name || '', 
    studentGender: student.student_gender || '', 
    studentDateOfBirth: student.student_date_of_birth ? student.student_date_of_birth.split('T')[0] : '',
    mobileNo: student.mobile_no,
    emailID: student.email_id,
    courseId: selectedCourse ? selectedCourse.course_id : '', 
    academicCourseYearId: selectedCourseYear ? selectedCourseYear.academic_course_year_id : '',
    studentEnrollmentDate: student.student_enrollment_date ? student.student_enrollment_date.split('T')[0] : '',
    studentAddress: student.student_address,
    studentStatus: student.student_status
  });

  this.studentId = student.student_id;
}


  
//  ✅ Reset the form after insert or update 
resetForm() {
  this.studentForm.reset();
  this.studentForm.markAsPristine();
  this.studentForm.markAsUntouched();
  this.studentId = 0; // Reset student ID

  console.log("🔹 courseId is re-enabled for new student");
}



onMobileBlur() {
  const mobileNo = this.studentForm.value.mobileNo;
  if (mobileNo) {
    this.spinner.show(); // ✅ Show global spinner while checking

    this.apiSer.checkDuplicateStudent(mobileNo, '', this.studentId).subscribe(
      (response) => {

         this.spinner.hide(); // ✅ Hide spinner

        if (!response.success) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Mobile Number',
            text: response.message,
            confirmButtonColor: '#d33'
          });
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide(); // ✅ Hide spinner
        console.error("❌ Error checking duplicate mobile:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.error?.message || "Error validating mobile number.",
          confirmButtonColor: '#d33'
        });
        this.spinner.hide();
      }
    );
  }
}

onEmailBlur() {
  const emailID = this.studentForm.value.emailID;
  if (emailID) {
    this.spinner.show(); // ✅ Show spinner while checking

    this.apiSer.checkDuplicateStudent('', emailID, this.studentId).subscribe(
      (response) => {
          this.spinner.hide(); // ✅ Hide spinner

        if (!response.success) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Email ID',
            text: response.message,
            confirmButtonColor: '#d33'
          });
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide(); // ✅ Hide spinner
        console.error("❌ Error checking duplicate email:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.error?.message || "Error validating email.",
          confirmButtonColor: '#d33'
        });
        this.spinner.hide();
      }
    );
  }
}



/** ✅ Check for Duplicate Mobile No & Email (Show Error in SweetAlert) */
checkDuplicate(mobileNo: string | null, emailID: string | null, field: 'mobileNo' | 'emailID') {
  this.apiSer.checkDuplicateStudent(mobileNo, emailID).subscribe(
    (response) => {
      if (!response.success) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate Entry',
          text: `${field === 'mobileNo' ? 'Mobile number' : 'Email ID'} already exists! Please use another.`,
          confirmButtonColor: '#d33'
        });
      }
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.error?.message || `Failed to check duplicate ${field}.`,
        confirmButtonColor: '#d33'
      });
    }
  );
}

editStudentold(student: any): void {
  const selectedCourse = this.coursesList.find(course => course.course_name === student.course_name);

  this.studentForm.patchValue({
    fullName: student.full_name,
    fatherName: student.father_name || '', // ✅ Fix null issue
    studentGender: student.student_gender || '', // ✅ Fix null issue
    studentDateOfBirth: student.student_date_of_birth ? student.student_date_of_birth.split('T')[0] : '', // ✅ Fix Date Format
    mobileNo: student.mobile_no,
    emailID: student.email_id,
    courseId: selectedCourse ? selectedCourse.course_id : '', 
    courseYear: student.course_year,
    year: student.student_enrollment_date,
    studentAddress: student.student_address,
    studentStatus: student.student_status
  });

  this.studentId = student.student_id; // ✅ Set student ID
}


   
  // closeModal(modalId: string, focusElementId: string) {
  //   const modalElement = document.getElementById(modalId);
  //   const focusElement = document.getElementById(focusElementId);
  
  //   if (modalElement) {
  //     modalElement.classList.remove('show'); // Hide modal
  //     modalElement.setAttribute('aria-hidden', 'true'); // Mark modal as hidden
  //     modalElement.removeAttribute('role');
  //     modalElement.style.display = 'none';
  
  //     // Move focus back to a visible button
  //     if (focusElement) {
  //       focusElement.focus();
  //     }
  //   }
  
  //   document.body.classList.remove('modal-open');
  //   const modalBackdrops = document.getElementsByClassName('modal-backdrop');
  //   while (modalBackdrops.length > 0) {
  //     modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
  //   }
  // }
  


  openEditStudentModal(username: string) {
    this.getStudentDetailsForEdit(username); // Fetch student details
  
    // ✅ Open Modal after ensuring data is loaded
    setTimeout(() => {
      const modalElement = document.getElementById("studentModal");
      if (modalElement) {
        modalElement.classList.add("show");
        modalElement.setAttribute("aria-hidden", "false");
        modalElement.setAttribute("role", "dialog");
        modalElement.style.display = "block";
        document.body.classList.add("modal-open");
      }
    }, 200);
  }
  

  getStudentDetails(username: string): void {
    // ✅ Clear previous student details before fetching new data
    this.studentDetails = null;
    this.promotionHistory = []; 
    this.subjectsList = [];
  
    this.apiSer.getStudentByUsername(username).subscribe(
      (response) => {
        if (response && response.student) {
          this.studentDetails = response.student;
          this.studentUsername = response.student.username;
          this.courseId = response.student.course_id;
  
          // ✅ Fetch additional student data
          this.getStudentMarks();
          this.getStudentSubjects();
          this.loadStudentPromotions(username);
  
          // ✅ Open View Modal after data is fully loaded
          setTimeout(() => {
            const modalElement = document.getElementById("studentDetailsModal");
            if (modalElement) {
              modalElement.classList.add("show");
              modalElement.setAttribute("aria-hidden", "false");
              modalElement.setAttribute("role", "dialog");
              modalElement.style.display = "block";
              document.body.classList.add("modal-open");
            }
          }, 200);
        }
      },
      (error) => {
        console.error("❌ Error fetching student details:", error);
        this.toastr.error("Failed to load student details. Please try again.", "Error");
        Swal.fire("❌ Error", "Failed to load student details.", "error");
      }
    );
  }
  
  
  // ✅ Method to fetch student marks
  getStudentMarks(): void {
    this.apiSer.getStudentMarksByUsername(this.studentUsername).subscribe(
      (marksResponse) => {
        if (marksResponse && marksResponse.success === false) {
          this.studentDetails.marks = [];
          this.toastr.info(marksResponse.message, "Info");
        } else if (marksResponse && marksResponse.results.length > 0) {
          this.studentDetails.marks = marksResponse.results;
          this.toastr.success("Student marks loaded successfully!", "Success");
        } else {
          this.studentDetails.marks = [];
          this.toastr.info("No marks available for this student.", "Info");
        }
      },
      (error) => {
        console.error("❌ Error fetching student marks:", error);
        this.toastr.error("Failed to load student marks. Please try again.", "Error");
        this.studentDetails.marks = [];
      }
    );
  }

  // ✅ Method to fetch student subjects
  getStudentSubjects(): void {
    this.apiSer.getSubjectsByUsernameAndCourse(this.studentUsername, this.courseId).subscribe({
      next: (response) => {
        if (response.success) {
          setTimeout(() => {
            this.spinner?.hide(); // ✅ Hide Spinner after timeout
          }, 500); // Hide after 0.5s
          this.subjectsList = response.subjects;
        } else {
          console.error('No subjects found:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching subjects:', error);
      }
    });
  }
 

   // ✅ Load Student Promotion History
   loadStudentPromotions(username: string) {
    // this.selectedUsername = username; // Store username for modal title
    this.apiSer.getPromotionHistory(username).subscribe(
        (res: any) => {
            if (res.success && res.history.length > 0) {
                this.promotionHistory = res.history; // ✅ Store all history records
                console.log("✅ Promotion History Loaded:", this.promotionHistory);
            } else {
                this.promotionHistory = [];
                this.toastr.warning(res.message || "⚠️ No promotion history found.");
            }
        },
        (error) => {
            this.promotionHistory = [];
            console.error("❌ Error fetching promotion history:", error);
            this.toastr.error("Something went wrong while fetching history.");
        }
    );
}
  
  

  getStudentDetailsexist(username: string): void {
    this.apiSer.getStudentByUsername(username).subscribe(
      (response) => {
        if (response && response.student) {
          this.studentDetails = response.student;
  
          // ✅ Disable form fields in View mode
          this.studentForm.disable();
  
          // ✅ Open View Modal
          setTimeout(() => {
            const modalElement = document.getElementById("studentDetailsModal");
            if (modalElement) {
              modalElement.classList.add("show");
              modalElement.setAttribute("aria-hidden", "false");
              modalElement.setAttribute("role", "dialog");
              modalElement.style.display = "block";
              document.body.classList.add("modal-open");
            }
          }, 200);
        }
      },
      (error) => {
        console.error("❌ Error fetching student details:", error);
        Swal.fire("❌ Error", "Failed to load student details.", "error");
      }
    );
  }
  

  getStudentDetailsForEdit(username: string): void {
    this.apiSer.getStudentByUsername(username).subscribe(
        (response) => {
            if (response && response.student) {
                const student = response.student;
                this.studentId = student.student_id;

                const selectedCourse = this.coursesList.find(course => course.course_id === student.course_id);

                this.studentForm.patchValue({
                    fullName: student.full_name || '',
                    fatherName: student.father_name || '',
                    studentGender: student.student_gender || '',
                    studentDateOfBirth: student.student_date_of_birth ? new Date(student.student_date_of_birth).toISOString().split('T')[0] : '',
                    mobileNo: student.mobile_no || '',
                    emailID: student.email_id || '',
                    courseId: selectedCourse ? selectedCourse.course_id : student.course_id,
                    academicCourseYearId: student.academic_course_year_id || '',
                    studentEnrollmentDate: student.student_enrollment_date ? new Date(student.student_enrollment_date).toISOString().split('T')[0] : '', // ✅ FIXED
                    studentAddress: student.student_address || '',
                    studentStatus: student.student_status || ''
                });

                // ✅ Enable form fields for editing
                this.studentForm.enable();

                // ✅ Mark form as dirty so submit button gets enabled
                this.studentForm.markAsDirty();

                console.log("✅ Student Data Loaded for Editing:", student);
            }
        },
        (error) => {
            console.error("❌ Error fetching student details:", error);
            Swal.fire("❌ Error", "Failed to load student details.", "error");
        }
    );
}


    

  navigateToPage() {
    // Hide modal manually
    const modal = document.querySelector('.modal.show');
    if (modal) {
      (modal as HTMLElement).classList.remove('show');
      (modal as HTMLElement).setAttribute('aria-hidden', 'true');
      (modal as HTMLElement).style.display = 'none';

      // Remove backdrop
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }

    // Navigate to another page
    this.router.navigate(['/admin/adminstudentresults']);
  }

  navigateAndCloseModal(modalId: string, focusElementId: string, route?: string) {
    const modalElement = document.getElementById(modalId);
    const focusElement = document.getElementById(focusElementId);
  
    if (modalElement) {
      if (focusElement) {
        focusElement.focus();
      }
  
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.removeAttribute("role");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");
  
      // ✅ Clear student data when closing modal
      this.studentDetails = null;
      this.promotionHistory = [];
      this.subjectsList = [];
  
      setTimeout(() => {
        const modalBackdrops = document.getElementsByClassName("modal-backdrop");
        while (modalBackdrops.length > 0) {
          modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
        }
  
        if (route) {
          this.router.navigate([route]);
        }
      }, 100);
    }
  }
  



  closeModalold(modalId: string, focusElementId: string) {
    const modalElement = document.getElementById(modalId);
    const focusElement = document.getElementById(focusElementId);
  
    if (modalElement) {
      // ✅ Move focus before hiding modal
      if (focusElement) {
        focusElement.focus();
      }
  
      // ✅ Hide modal properly
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.removeAttribute("role");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");
  
      // ✅ Reset form after closing
      this.studentForm.reset();
      this.studentId = 0; // Reset Student ID
  
      // ✅ Remove backdrop
      setTimeout(() => {
        const modalBackdrops = document.getElementsByClassName("modal-backdrop");
        while (modalBackdrops.length > 0) {
          modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
        }
      }, 100);
    }
  }
}