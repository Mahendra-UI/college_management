import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-studentroomrequest',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './studentroomrequst.component.html',
  styleUrl: './studentroomrequst.component.scss'
})
export class StudentroomrequstComponent implements OnInit {

  selectedRequest: any = null;
  selectedRequestId: number | null = null;

  roomRequestForm!: FormGroup;
  academicYears: any[] = [];
  roomRequests: any[] = [];
  students: any[] = [];
  selectedusername: string | null = null;
  selectedStudentId: number | null = null;  // ✅ Store student ID
  isLoading = false;

  academicYearId: number | null = null;
  academicYearName: string | null = null;

  dropdownSettings = {
    singleSelection: false,
    idField: 'student_id',
    textField: 'full_name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection: 3
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {

    console.log("Fetching stored values from sessionStorage...");
  
    // ✅ Ensure sessionStorage values are assigned first
    this.selectedusername = sessionStorage.getItem('username') || null;
    this.selectedStudentId = sessionStorage.getItem('student_id') ? Number(sessionStorage.getItem('student_id')) : null;
    this.academicYearId = sessionStorage.getItem('academic_course_year_id') ? Number(sessionStorage.getItem('academic_course_year_id')) : null;
    this.academicYearName = sessionStorage.getItem('academic_course_year_name') || '';
  
    console.log("sessionStorage fullName:", sessionStorage.getItem('fullName'));
    console.log("sessionStorage username:", this.selectedusername);
    console.log("sessionStorage student_id:", this.selectedStudentId);
    console.log("sessionStorage course_name:", sessionStorage.getItem('course_name'));
    console.log("sessionStorage academic_course_year_name:", this.academicYearName);
  
    if (!this.selectedusername || !this.selectedStudentId) {
      console.warn("⚠️ Warning: No logged-in user detected.");
    }
  
    // ✅ Initialize Form AFTER sessionStorage values are assigned
    this.initializeForm();
  
    // ✅ Patch Form Values
    this.roomRequestForm.patchValue({
      academic_course_year_id: this.academicYearId,
      academic_course_year_name: this.academicYearName,
      student_username: this.selectedusername
    });
  
    // ✅ Load Students AFTER sessionStorage values are assigned
    this.getStudents();
  
    // ✅ Load Room Requests AFTER username is assigned
    this.getStudentRequests();
  }
  

  initializeForm(): void {
    this.roomRequestForm = this.fb.group({
      academic_course_year_id: [null, Validators.required],
      academic_course_year_name: [{ value: '', disabled: true }, Validators.required],  // ✅ Add this line
      student_username: ['', Validators.required],
      selectedStudents: [[], Validators.required]
    });
  
    console.log("✅ Form Initialized:", this.roomRequestForm.value);
  }
  

  /** ✅ Fetch Student Data */
  loadStudentData(): void {
    this.selectedusername = sessionStorage.getItem('username') || null;
    this.selectedStudentId = Number(sessionStorage.getItem('student_id') || 0);
  }
  
  /** ✅ Fetch Students Automatically Based on Academic Year */
 /** ✅ Fetch Students Based on Academic Year */
 getStudents(): void {
  if (!this.academicYearId) return;

  this.apiService.getStudentsByAcademicCourseYear(this.academicYearId).subscribe(
    (res) => {
      if (res.success) {
        this.students = res.students;
        console.log("✅ Loaded students:", this.students);
      } else {
        this.students = [];
        console.error("❌ No students found for this academic year");
      }
    },
    (error) => {
      console.error("❌ Error fetching students:", error);
    }
  );
}


  /** ✅ Submit Room Request */

  submitRequest(): void {
    console.log("🚀 Submitting Room Request...");
  
    // ✅ Validate sessionStorage before submitting
    this.selectedusername = sessionStorage.getItem('username') || null;
    this.selectedStudentId = Number(sessionStorage.getItem('student_id') || 0);  

    if (!this.selectedusername || !this.selectedStudentId) {
        console.error("❌ No logged-in user detected. Preventing submission.");
        this.spinner.hide();
        this.isLoading = false;
        this.handleErrorResponse("You must be logged in to request a room!");
        return;
    }

    if (this.roomRequestForm.invalid) {
        this.toastr.warning("Please fill all required fields", "Warning");
        return;
    }

    this.spinner.show();
    this.isLoading = true;

    let selectedStudents = [...this.roomRequestForm.value.selectedStudents];

    console.log("DEBUG: Selected Students List:", selectedStudents);

    // ✅ Ensure student IDs are numbers
    selectedStudents = selectedStudents.map(s => ({
        ...s,
        student_id: Number(s.student_id)
    }));

    // ✅ Ensure logged-in student is included
    const isUserIncluded = selectedStudents.some(
        (student) => student.student_id === this.selectedStudentId
    );

    if (!isUserIncluded) {
        this.spinner.hide();
        this.isLoading = false;
        this.handleErrorResponse("You must include yourself in the selected students list before submitting.");
        return;
    }

    const requestData = {
        academic_course_year_id: this.roomRequestForm.value.academic_course_year_id,
        student_id: this.selectedStudentId,  
        username: this.selectedusername,
        selected_students: selectedStudents.map(s => s.student_id),
        requested_by: this.selectedStudentId,
        requested_for: selectedStudents.map(s => s.student_id)
    };

    console.log("DEBUG: Final Request Payload:", requestData);

    this.apiService.submitRoomRequest(requestData).subscribe(
        (res) => {
            this.spinner.hide();
            this.isLoading = false;

            if (res.success) {
                this.toastr.success("✅ Room request submitted successfully!", "Success");

                Swal.fire({
                    icon: "success",
                    title: "Room Request Submitted",
                    text: "Your request has been successfully submitted. Please wait for approval.",
                    confirmButtonText: "OK",
                });
                this.roomRequestForm.reset();
                this.getStudentRequests();
            } else {
                this.handleErrorResponse(res.message);
            }
        },
        (error) => {
            this.spinner.hide();
            this.isLoading = false;
            console.error("❌ Request Submission Error:", error);
            this.handleErrorResponse(error?.error?.message || "Something went wrong while submitting your request.");
        }
    );
}

/** ✅ Handle API Error Messages */
handleErrorResponse(errorMessage: string): void {
    this.toastr.error(errorMessage, "Error");

    Swal.fire({
        icon: "error",
        title: "Request Submission Failed",
        text: errorMessage,
        confirmButtonText: "OK",
    });
}

   

  /** ✅ Prevent Removing Logged-in Student */
  preventRemovingLoggedInUser(event: any): void {
    if (event.student_id === this.selectedStudentId) {
      this.toastr.warning("You cannot remove yourself from the request!", "Warning");

      this.roomRequestForm.controls['selectedStudents'].setValue([
        ...this.roomRequestForm.value.selectedStudents,
        { student_id: this.selectedStudentId, username: this.selectedusername }
      ]);
    }
  }

  /** ✅ Fetch Room Requests */

/** ✅ Fetch Room Requests */

getStudentRequests(): void {
  if (!this.selectedusername) {
    console.error("❌ No username found in session storage.");
    return;
  }

  console.log("📥 Fetching Room Requests for username:", this.selectedusername);

  this.apiService.getStudentRoomRequestsByUsername(this.selectedusername.trim()).subscribe(
    (res) => {
      console.log("📜 API Response for Room Requests:", res);

      if (res.success && Array.isArray(res.requests)) {
        this.roomRequests = res.requests.map(request => ({
          ...request,
          requested_for: Array.isArray(request.requested_for) ? request.requested_for : []
        }));

        console.log("✅ Loaded Room Requests:", this.roomRequests);
      } else {
        this.roomRequests = [];
        console.warn("⚠️ No room requests found.");
        this.toastr.info("No room requests found.", "Info");
      }
    },
    (error) => {
      console.error("❌ Error fetching student room requests:", error);
      this.toastr.error("Failed to load room requests. Please try again later.", "Error");
    }
  );
}

loadRoomRequestDetails(requestId: number): void {
  this.apiService.getRoomRequestByRequestId(requestId).subscribe(
    (res) => {
      if (res.success) {
        this.selectedRequest = res.request;
        console.log("✅ Loaded Room Request:", this.selectedRequest);
      } else {
        this.selectedRequest = null;
        this.toastr.warning("No room request found for this ID.", "Warning");
      }
    },
    (error) => {
      console.error("❌ Error fetching room request:", error);
      this.toastr.error("Failed to load room request. Please try again later.", "Error");
    }
  );
}

requestHistory : any[] = [];

loadRequestHistory(requestId: any) {
  this.selectedRequest = this.roomRequests.find(req => req.request_id === requestId);
  this.apiService.getRoomRequestHistory(requestId).subscribe((response: any) => {
    if (response.success) {
      this.requestHistory = response.history;
    } else {
      this.requestHistory = [];
    }
  }, error => {
    console.error("Error fetching request history:", error);
    this.requestHistory = [];
  });
}


}
