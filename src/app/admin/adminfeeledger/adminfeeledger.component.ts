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
    this.initForm();
    this.loadFeeData();
  }

  /** ✅ Initialize Form */
  initForm() {
    this.feeForm = this.fb.group({
      fee_ledger_id: [null],
      fee_type_id: ['', Validators.required],
      course_id: ['', Validators.required],
      semester_id: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern("^[0-9]{4}$")]],
      fee_amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  /** ✅ Load Data */

  loadFeeData(callback?: () => void) {
    this.apiSer.getFeeTypes().subscribe(res => this.feeTypes = res.feeTypes);
    this.apiSer.getCourses().subscribe(res => this.coursesList = res);
    this.apiSer.getSemesters().subscribe(res => {
      this.semesters = res.semesters;
      if (callback) callback();
    });
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
  
        this.feeForm.patchValue({
          fee_ledger_id: res.feeRecord.fee_ledger_id,
          fee_type_id: res.feeRecord.fee_type_id,
          course_id: res.feeRecord.course_id,
          semester_id: res.feeRecord.semester_id,
          year: res.feeRecord.year,
          fee_amount: res.feeRecord.fee_amount
        });
  
        console.log("✅ Editing Fee Record:", this.feeForm.value);
      } else {
        this.toastr.error("Error fetching fee ledger record.");
      }
    });
  }

  onEditold(fee_ledger_id: number) {
    this.apiSer.getFeeLedgerById(fee_ledger_id).subscribe(res => {
      if (res.success) {
        const record = res.feeRecord;
        console.log("✅ Editing Record:", record);
  
        this.editingFeeId = record.fee_ledger_id;
  
        // Ensure dropdown values are bound correctly before patching
        this.loadFeeData(() => {
          const formValues = {
            fee_ledger_id: record.fee_ledger_id,
            fee_type_id: record.fee_type_id,
            course_id: record.course_id,
            semester_id: record.semester_id,
            year: record.year,
            fee_amount: record.fee_amount,
          };
  
          console.log("🛠️ Patching Form with:", formValues);
          this.feeForm.patchValue(formValues);
        });
      }
    });
  }
  

  

  /** ✅ View Fee Record */
  onView(record: any) {
    this.selectedFee = record;
  }

  onSubmit() {
    if (this.feeForm.valid) {
      let feeData = this.feeForm.value;
      
      // ✅ Convert `year` to an INTEGER before sending it to API
      feeData.year = parseInt(feeData.year);
  
      if (this.editingFeeId) {
        this.apiSer.updateFeeLedger(this.editingFeeId, feeData).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Updated!", "success");
            this.loadFeeData();
            this.resetForm();
          },
          error => {
            Swal.fire("❌ Error", "Failed to update Fee Record.", "error");
          }
        );
      } else {
        this.apiSer.addFeeLedger(feeData).subscribe(
          res => {
            Swal.fire("✅ Success", "Fee Record Added!", "success");
            this.loadFeeData();
            this.resetForm();
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
    this.feeForm.markAsUntouched();
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
