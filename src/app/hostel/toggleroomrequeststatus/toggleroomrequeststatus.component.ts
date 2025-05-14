import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toggleroomrequeststatus',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './toggleroomrequeststatus.component.html',
  styleUrl: './toggleroomrequeststatus.component.scss'
})
export class ToggleroomrequeststatusComponent implements OnInit {

academicYearStatusForm! : FormGroup;

academicCourseYearsList: any[] = [];
  selectedYear: number | null = null;
  selectedStatus: string = '';
  academicYearStatuses: any[] = [];

  constructor(private apiSer: ApiService, private toastr: ToastrService, private fb: FormBuilder) {}

  ngOnInit(): void {
        this.initForm();
    this.loadAcademicCourseYears();
    this.fetchStatuses();
  }

  initForm() {
    this.academicYearStatusForm = this.fb.group({
      academic_course_year_id: ['', Validators.required],
      status: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  loadAcademicCourseYears(): void {
    this.apiSer.getAcademicCourseYears().subscribe(
      (res: any) => {
        if (res.success && res.academicYears) {
          this.academicCourseYearsList = res.academicYears.filter(
            (year: any) => year.academic_course_year_id !== 5
          );
        }
      },
      (error) => {
        this.academicCourseYearsList = [];
        console.error("❌ Error loading academic years:", error);
      }
    );
  }

onYearChange(): void {
  const selectedYear = this.academicYearStatusForm.get('academic_course_year_id')?.value;

  if (!selectedYear) return;

  this.apiSer.getRoomRequestStatusById(selectedYear).subscribe(
    (res) => {
      if (res.success && res.status) {
        this.academicYearStatusForm.patchValue({
          status: res.status.status
        });
      } else {
        this.academicYearStatusForm.patchValue({ status: '' });
      }
    },
    (error) => {
      console.error("❌ Failed to fetch status by ID:", error);
    }
  );
}

editingStatusId: number | null = null;


onSubmit(): void {
  if (this.academicYearStatusForm.invalid) {
    this.toastr.warning('Please select both year and status.', 'Warning');
    return;
  }

  const payload = this.academicYearStatusForm.value;

  if (this.editingStatusId) {
    // 🔁 Update existing using status_id
    this.apiSer.updateRoomRequestStatusByAdmin(this.editingStatusId, payload.status).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Status updated successfully');
          this.fetchStatuses();
          this.academicYearStatusForm.reset();
          this.editingStatusId = null; // Reset editing state
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      (error) => {
        this.toastr.error(error?.error?.message || 'Something went wrong during update.', 'Error');
      }
    );
  } else {
    // ➕ Insert new
    this.apiSer.createRoomRequestStatus(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Status created successfully');
          this.fetchStatuses();
          this.academicYearStatusForm.reset();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      (error) => {
  const errMsg =
    error?.error?.error ||
    error?.message ||
    'Something went wrong during update.';

  this.toastr.error(errMsg, 'Error');
}
      // (error) => {
      //   this.toastr.error(error?.error?.message || 'Something went wrong during creation.', 'Error');
      // }
    );
  }
}



  fetchStatuses(): void {
    this.apiSer.getRoomRequestStatusesByAdmin().subscribe(
      (res) => {
        if (res.success) {
          this.academicYearStatuses = res.statuses;
        }
      },
      (error) => {
        console.error("❌ Error fetching status list:", error);
      }
    );
  }

  onEdit(statusId: number): void {
  this.apiSer.getRoomRequestStatusById(statusId).subscribe(
    (res: any) => {
      if (res.success && res.status) {
        this.editingStatusId = res.status.status_id; // Track ID for update
        this.academicYearStatusForm.patchValue({
          academic_course_year_id: res.status.academic_course_year_id,
          status: res.status.status,
          gender: res.status.gender
        });
      } else {
        this.toastr.warning('Status not found for the selected ID.', 'Warning');
      }
    },
    (error) => {
      console.error("❌ Failed to fetch status by status ID:", error);
      this.toastr.error('Failed to load status details.', 'Error');
    }
  );
}


}
