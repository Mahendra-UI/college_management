import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-managestudents',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule], // ✅ Import NgxPaginationModule
  templateUrl: './managestudents.component.html',
  styleUrl: './managestudents.component.scss'
})
export class ManagestudentsComponent implements OnInit {

  filteredStudents: any[] = []; // Filtered list for search
  searchText: string = ''; // Search text
  itemsPerPage: number = 50;
  currentPage!: number;
  p: number = 1; // Default page number
  onPageChange(e: number) {
    if (e) {
      this.p = e;
    }
  }

  isSubmitting: boolean = false; // ✅ FIXED Missing Variable
  isCheckingDuplicate : boolean = false;

  studentsList: any[] = [];
  coursesList: any[] = [];
  studentForm!: FormGroup;
  message: string = '';
  studentDetails: any = null;
  studentId: number = 0; // Default student ID
  yearsList: number[] = []; // Dynamic year list


  constructor(private apiSer: ApiService, private fb: FormBuilder, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
// ✅ Populate Year Dropdown (Last 10 Years)
this.loadYears();
this.initializeForm();
this.loadStudents();
this.loadCourses();
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
    studentGender: ['', Validators.required], // ✅ Added gender
    studentDateOfBirth: ['', Validators.required], // ✅ Added DOB
    courseId: ['', Validators.required],
    courseYear: ['', Validators.required],
    year: ['', Validators.required],
    studentAddress: ['', Validators.required],
    studentStatus: ['', Validators.required]
  });
  
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
      this.studentsList = data;
      this.filteredStudents = data; // Initialize filtered list
    },
    (error) => {
      console.error('Error fetching students', error);
    }
  );
}

// ✅ Search Function
filterStudents(): void {
  this.filteredStudents = this.studentsList.filter(student => {
    return Object.values(student).some((value: any) =>
      value.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  });
}

  /**
   * Load courses
   */
  loadCourses(): void {
    this.apiSer.getCourses().subscribe(
      (data) => {
        this.coursesList = data;
      },
      (error) => {
        console.error('Error fetching courses', error);
      }
    );
  }

/**
   * ✅ Insert or Update Student
   */

onSubmitoldnew() {
  if (this.studentForm.valid) {
    this.isSubmitting = true;

    const selectedCourse = this.coursesList.find(course => course.course_id == this.studentForm.value.courseId);

    const studentData = {
      student_id: this.studentId,
      full_name: this.studentForm.value.fullName,
      father_name: this.studentForm.value.fatherName,
      mobile_no: this.studentForm.value.mobileNo,
      email_id: this.studentForm.value.emailID,
      student_gender: this.studentForm.value.studentGender,
      student_date_of_birth: this.studentForm.value.studentDateOfBirth,
      course_id: this.studentForm.value.courseId,
      course_name: selectedCourse ? selectedCourse.course_name : '',
      course_year: this.studentForm.value.courseYear,
      enrollment_year: Number(this.studentForm.value.year),
      student_address: this.studentForm.value.studentAddress,
      student_status: this.studentForm.value.studentStatus
    };

    if (this.studentId && this.studentId !== 0) {
      this.apiSer.updateStudent(studentData).subscribe(
        response => {
          Swal.fire("✅ Success", "Student Updated Successfully", "success");
          this.loadStudents();
          this.resetForm();
        },
        error => {
          Swal.fire("❌ API Error", error.message, "error");
        }
      );
    } else {
      this.apiSer.saveStudent(studentData).subscribe(
        response => {
          Swal.fire("✅ Success", "Student Inserted Successfully", "success");
          this.loadStudents();
          this.resetForm();
        },
        error => {
          Swal.fire("❌ API Error", error.message, "error");
        }
      );
    }
  } else {
    Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly", "warning");
  }
}

onSubmit() {
  if (this.studentForm.valid) {
    this.isSubmitting = true;

    const selectedCourse = this.coursesList.find(course => course.course_id == this.studentForm.value.courseId);

    const studentData = {
      student_id: this.studentId,
      full_name: this.studentForm.value.fullName,
      father_name: this.studentForm.value.fatherName,
      mobile_no: this.studentForm.value.mobileNo,
      email_id: this.studentForm.value.emailID,
      student_gender: this.studentForm.value.studentGender,
      student_date_of_birth: this.studentForm.value.studentDateOfBirth,
      course_id: this.studentForm.value.courseId,
      course_name: selectedCourse ? selectedCourse.course_name : '',
      course_year: this.studentForm.value.courseYear,
      enrollment_year: Number(this.studentForm.value.year),
      student_address: this.studentForm.value.studentAddress,
      student_status: this.studentForm.value.studentStatus
    };

    // ✅ Check for duplicate before inserting/updating
    this.apiSer.checkDuplicateStudent(studentData.mobile_no, studentData.email_id, studentData.student_id).subscribe(
      (response) => {
        if (!response.success) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry',
            text: response.message,
            confirmButtonColor: '#d33'
          });
          this.isSubmitting = false;
        } else {
          // ✅ Proceed with Insert or Update
          if (this.studentId && this.studentId !== 0) {
            this.apiSer.updateStudent(studentData).subscribe(
              response => {
                Swal.fire("✅ Success", "Student Updated Successfully", "success");
                this.loadStudents();
                this.resetForm();
              },
              error => {
                Swal.fire("❌ API Error", error.message, "error");
              }
            );
          } else {
            this.apiSer.saveStudent(studentData).subscribe(
              response => {
                Swal.fire("✅ Success", "Student Inserted Successfully", "success");
                this.loadStudents();
                this.resetForm();
              },
              error => {
                Swal.fire("❌ API Error", error.message, "error");
              }
            );
          }
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.error?.message || "Failed to check duplicate values.",
          confirmButtonColor: '#d33'
        });
        this.isSubmitting = false;
      }
    );
  } else {
    Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly", "warning");
  }
}


editStudent(student: any): void {
  const selectedCourse = this.coursesList.find(course => course.course_name === student.course_name);

  this.studentForm.patchValue({
    fullName: student.full_name,
    fatherName: student.father_name || '', 
    studentGender: student.student_gender || '', 
    studentDateOfBirth: student.student_date_of_birth ? student.student_date_of_birth.split('T')[0] : '',
    mobileNo: student.mobile_no,
    emailID: student.email_id,
    courseId: selectedCourse ? selectedCourse.course_id : '', 
    courseYear: student.course_year,
    year: student.enrollment_year,
    studentAddress: student.student_address,
    studentStatus: student.student_status
  });

  this.studentId = student.student_id;
}


onSubmitold() {
  if (this.studentForm.valid) {
    const selectedCourse = this.coursesList.find(course => course.course_id == this.studentForm.value.courseId);

    const studentData = {
      student_id: this.studentId,
      full_name: this.studentForm.value.fullName,
      father_name: this.studentForm.value.fatherName,
      mobile_no: this.studentForm.value.mobileNo,
      email_id: this.studentForm.value.emailID,
      student_gender: this.studentForm.value.studentGender,
      student_date_of_birth: this.studentForm.value.studentDateOfBirth,
      course_id: this.studentForm.value.courseId,
      course_name: selectedCourse ? selectedCourse.course_name : '',
      course_year: this.studentForm.value.courseYear,
      enrollment_year: Number(this.studentForm.value.year),
      student_address: this.studentForm.value.studentAddress,
      student_status: this.studentForm.value.studentStatus
    };

    if (this.studentId && this.studentId !== 0) {
      // ✅ Update Student
      this.apiSer.updateStudent(studentData).subscribe(
        response => {
          Swal.fire("✅ Success", "Student Updated Successfully", "success");
          this.loadStudents();
          this.resetForm();
        },
        error => {
          Swal.fire("❌ API Error", error.message, "error");
        }
      );
    } else {
      // ✅ Insert Student
      this.apiSer.saveStudent(studentData).subscribe(
        response => {
          Swal.fire("✅ Success", "Student Inserted Successfully", "success");
          this.loadStudents();
          this.resetForm();
        },
        error => {
          Swal.fire("❌ API Error", error.message, "error");
        }
      );
    }
  } else {
    Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly", "warning");
  }
}
  
//  ✅ Reset the form after insert or update 
resetForm() {
  this.studentForm.reset();
  this.studentForm.markAsPristine();
  this.studentForm.markAsUntouched();
  this.studentId = 0; // Reset student ID

  console.log("🔹 courseId is re-enabled for new student");
}

getStudentDetailsold(username: string): void {
  this.apiSer.getCourses().subscribe((courses) => {
    this.coursesList = courses; // ✅ Ensure courses are loaded before mapping

    this.apiSer.getStudentByUsername(username).subscribe(
      (response) => {
        if (response && response.student) {
          const data = response.student;
          this.studentDetails = data;
          this.studentId = data.student_id;

          // ✅ Ensure course_id is correctly mapped
          const selectedCourse = this.coursesList.find(course => course.course_id === data.course_id);

          this.studentForm.patchValue({
            fullName: data.full_name || '',
            fatherName: data.father_name || '',
            studentGender: data.student_gender || '', 
            studentDateOfBirth: data.student_date_of_birth ? new Date(data.student_date_of_birth).toISOString().split('T')[0] : '', 
            mobileNo: data.mobile_no || '',
            emailID: data.email_id || '',
            courseId: selectedCourse ? selectedCourse.course_id : data.course_id,  // ✅ Use course_id directly
            courseYear: data.course_year || '',
            year: data.enrollment_year ? data.enrollment_year.toString() : '',  
            studentAddress: data.student_address || '',
            studentStatus: data.student_status || '',
            username: data.username || '',  // ✅ Now bound as readonly field
            rollNumber: data.roll_number || '' // ✅ Now bound as readonly field
          });

          console.log("🔹 Student Data Received (getStudentDetails):", data);
          console.log("🔹 Form Values After Patch (getStudentDetails):", this.studentForm.value);

          this.studentForm.markAsDirty();
          this.studentForm.markAllAsTouched();
        }
      },
      (error) => {
        console.error('❌ Error fetching student details', error);
        this.spinner.hide();
      }
    );
  });
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
    year: student.enrollment_year,
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
            courseYear: student.course_year || '',
            year: student.enrollment_year ? student.enrollment_year.toString() : '',
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
    

  

  closeModal(modalId: string, focusElementId: string) {
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