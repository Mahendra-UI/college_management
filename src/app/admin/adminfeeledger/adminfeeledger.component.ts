import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminfeeledger',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './adminfeeledger.component.html',
  styleUrl: './adminfeeledger.component.scss'
})
export class AdminfeeledgerComponent implements OnInit {
  feeForm!: FormGroup;
  feeTypes: any[] = [];
  coursesList: any[] = [];
  semesters: any[] = [];
  feeRecords: any[] = [];
  editingFeeId: number | null = null;
  selectedFee: any = null; // For Viewing Modal

  constructor(
    private fb: FormBuilder,
    private apiSer: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFeeData();
    this.initForm();
    this.loadFeeTypes();
  }

  /** ✅ Initialize Form */
  initForm() {
    this.feeForm = this.fb.group({
      fee_ledger_id: [null],
      fee_type_id: ['', Validators.required],
      course_id: ['', Validators.required],
      semester_id: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern("^[0-9]{4}$")]],
      fee_amount: ['', [Validators.required, Validators.min(1)]],
      fee_ledger_description: ['', [Validators.required, Validators.maxLength(500)]],  // ✅ New field
    });
    
  }

/** ✅ Load Fee Types First */
loadFeeTypes() {
  this.apiSer.getFeeTypes().subscribe(res => {
    this.feeTypes = res.feeTypes;
    console.log("✅ Fee Types Loaded");
  });
}


/** ✅ Load Courses when Fee Type is Selected */
onFeeTypeSelect() {
  this.feeForm.controls['course_id'].reset();
  this.feeForm.controls['semester_id'].reset();
  this.feeForm.controls['semester_id'].disable(); // Disable semester until course is selected

  this.apiSer.getCourses().subscribe(res => {
    this.coursesList = res.courses;
    console.log("✅ Courses Loaded");
    this.feeForm.controls['course_id'].enable();
  });
}


/** ✅ Load Semesters when Course is Selected */
onCourseSelect() {
  this.feeForm.controls['semester_id'].reset();
  this.feeForm.controls['semester_id'].disable(); // Disable until loaded

  this.apiSer.getSemesters().subscribe(res => {
    this.semesters = res.semesters;
    console.log("✅ Semesters Loaded");
    this.feeForm.controls['semester_id'].enable();
  });
}


 /** ✅ Enable Year & Fee Amount when Semester is Selected */
 onSemesterSelect() {
  this.feeForm.controls['year'].enable();
  this.feeForm.controls['fee_amount'].enable();
}

  /** ✅ Load Data */

  loadFeeData() {
  // loadFeeData(callback?: () => void) {
    // this.apiSer.getFeeTypes().subscribe(res => this.feeTypes = res.feeTypes);
    // this.apiSer.getCourses().subscribe(res => this.coursesList = res);
    // this.apiSer.getSemesters().subscribe(res => {
    //   this.semesters = res.semesters;
    //   if (callback) callback();
    // });
    this.apiSer.getFeeLedgers().subscribe(res => this.feeRecords = res.feeRecords);
  }
  

  // loadFeeData() {
  //   this.apiSer.getFeeTypes().subscribe(res => this.feeTypes = res.feeTypes);
  //   this.apiSer.getCourses().subscribe(res => this.coursesList = res);
  //   this.apiSer.getSemesters().subscribe(res => this.semesters = res.semesters);
  //   this.apiSer.getFeeLedgers().subscribe(res => this.feeRecords = res.feeRecords);
  // }


  onEdit(fee_ledger_id: number) {
    this.apiSer.getFeeLedgerById(fee_ledger_id).subscribe(res => {
      if (res.success) {
        this.editingFeeId = res.feeRecord.fee_ledger_id;
  
        // ✅ Load Courses First
        this.apiSer.getCourses().subscribe(courseRes => {
          this.coursesList = courseRes.courses;  // Ensure correct key
          this.feeForm.controls['course_id'].enable(); // Enable dropdown
  
          // ✅ Now, Load Semesters
          this.apiSer.getSemesters().subscribe(semRes => {
            this.semesters = semRes.semesters; // Ensure correct key
            this.feeForm.controls['semester_id'].enable(); // Enable dropdown
  
            // ✅ PATCH FORM after data is loaded
            setTimeout(() => {
              this.feeForm.patchValue({
                fee_ledger_id: res.feeRecord.fee_ledger_id,
                fee_type_id: res.feeRecord.fee_type_id,
                course_id: res.feeRecord.course_id,
                semester_id: res.feeRecord.semester_id,
                year: res.feeRecord.year,
                fee_amount: res.feeRecord.fee_amount,
                fee_ledger_description: res.feeRecord.fee_ledger_description
              });
              console.log("✅ Form Bound:", this.feeForm.value);
            }, 500);  // Adding slight delay ensures dropdowns are loaded
          });
        });
  
      } else {
        this.toastr.error("Error fetching fee ledger record.");
      }
    });
  }
  
 

  /** ✅ View Fee Record */
  onView(record: any) {
    this.selectedFee = record;
  }

/** ✅ Submit (Add or Update) Fee Ledger */
onSubmit() {
  if (this.feeForm.valid) {
    let feeData = this.feeForm.value;
    feeData.year = parseInt(feeData.year); // Convert to Integer

    if (this.editingFeeId) {
      this.apiSer.updateFeeLedger(this.editingFeeId, feeData).subscribe(
        res => {
          Swal.fire("✅ Success", "Fee Record Updated!", "success");
          this.resetForm();
          this.loadFeeData();
        },
        error => {
          Swal.fire("❌ Error", "Failed to update Fee Record.", "error");
        }
      );
    } else {
      this.apiSer.addFeeLedger(feeData).subscribe(
        res => {
          Swal.fire("✅ Success", "Fee Record Added!", "success");
          this.resetForm();
          this.loadFeeData();
        },
        error => {
          Swal.fire("❌ Error", "Failed to add Fee Record.", "error");
        }
      );
    }
  } else {
    Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly.", "warning");
  }
}

  /** ✅ Submit (Add or Update) */
  onSubmitold() {
    if (this.feeForm.valid) {
      let feeData = this.feeForm.value;
      
      if (this.editingFeeId) {
        this.apiSer.updateFeeLedger(this.editingFeeId, feeData).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Updated!", "success");
            this.loadFeeData();
            this.resetForm();
          },
          error => Swal.fire("❌ Error", "Failed to update Fee Record.", "error")
        );
      } else {
        this.apiSer.addFeeLedger(feeData).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Added!", "success");
            this.loadFeeData();
            this.resetForm();
          },
          error => Swal.fire("❌ Error", "Failed to add Fee Record.", "error")
        );
      }
    } else {
      Swal.fire("❌ Invalid Form", "Please fill in all required fields correctly.", "warning");
    }
  }

  /** ✅ Delete Fee Record */
  deleteFee(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.isConfirmed) {
        this.apiSer.deleteFeeLedger(id).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Deleted!", "success");
            this.loadFeeData();
          }
        );
      }
    });
  }


 /** ✅ Reset Form */
 resetForm() {
  this.editingFeeId = null;
  this.feeForm.reset();
  this.initForm();
}

  /** ✅ Delete Fee Ledger */
  deleteFeef(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.isConfirmed) {
        this.apiSer.deleteFeeLedger(id).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Deleted!", "success");
            this.loadFeeData();
          },
          error => {
            Swal.fire("❌ Error", "Failed to delete Fee Record.", "error");
          }
        );
      }
    });
  }
}
