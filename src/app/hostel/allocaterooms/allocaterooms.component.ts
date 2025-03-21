import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-allocaterooms',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule, NgxPaginationModule],
  templateUrl: './allocaterooms.component.html',
  styleUrl: './allocaterooms.component.scss'
})
export class AllocateroomsComponent implements OnInit {
  allocationForm!: FormGroup;
  students: any[] = [];
  availableRooms: any[] = [];
  hostels: any[] = [];
  blocks: any[] = [];
  floors: any[] = [];
  allocatedRooms: any[] = [];
  academicYears: any[] = [];
  dropdownSettings: any = {}; // Multi-select settings


  isLoading = false; // ✅ Spinner flag


  filteredAllocatedRooms: any[] = [];
  searchText: string = '';
  itemsPerPage: number = 5; // Number of records per page
  currentPage: number = 1;
  totalRecords: number = 0;

  selectedUsernames: string = '';


  constructor(private fb: FormBuilder, private apiSer: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.getHostels();
    this.loadAcademicCourseYears();
    this.allocationForm = this.fb.group({
      academic_course_year_id: ['', Validators.required],
      selectedStudents: [[], Validators.required],
      hostel_id: ['', Validators.required],
      block_id: ['', Validators.required],
      floor_id: ['', Validators.required],
      room_id: ['', Validators.required]
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'student_id', 
      textField: 'full_name', 
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 3
    };    

    this.getAllocatedRooms();
  }

/**
   * ✅ Load academic course years
   */
loadAcademicCourseYears(): void {
  this.apiSer.getAcademicCourseYears().subscribe(
    (res: any) => {
      if (res.success && res.academicYears) {
        // ✅ Filter out "Course Completed" (academic_course_year_id = 5)
        this.academicYears = res.academicYears.filter(
          (year: any) => year.academic_course_year_id !== 5
        );
        console.log("✅ Loaded Academic Course Years (Excluding Course Completed):", this.academicYears);
      } else {
        this.academicYears = [];
        console.error("❌ Failed to load academic course years: No data found");
      }
    },
    (error) => {
      this.academicYears = [];
      console.error("❌ Error fetching academic course years:", error);
    }
  );
}


  /** ✅ Fetch Students Based on Selected Academic Year */
  getStudents() {
    const yearId = this.allocationForm.value.academic_course_year_id;
    if (!yearId) return;

    this.apiSer.getStudentsByAcademicCourseYear(yearId).subscribe(
      res => {
        if (res.success && res.students) {
          this.students = res.students;
          console.log("✅ Current students array:", this.students);
        } else {
          this.students = [];
        }
      },
      error => {
        console.error("❌ Error fetching students:", error);
      }
    );
  }

  /** ✅ Fetch Hostels */
  getHostels() {
    this.apiSer.getHostels().subscribe(res => {
      this.hostels = res.hostels;
    });
  }

  /** ✅ Fetch Blocks Based on Selected Hostel */
  getBlocks() {
    const hostelId = this.allocationForm.value.hostel_id;
    if (!hostelId) return;

    this.apiSer.getBlocksByHostel(hostelId).subscribe(res => {
      this.blocks = res.blocks;
      this.floors = []; // Reset floors when hostel changes
      this.availableRooms = []; // Reset rooms when hostel changes
    });
  }

  /** ✅ Fetch Floors Based on Selected Block and Hostel */
  getFloors() {
    const blockId = this.allocationForm.value.block_id;
    const hostelId = this.allocationForm.value.hostel_id;
    if (!blockId || !hostelId) return;

    this.apiSer.getFloorsByBlockAndHostel(blockId, hostelId).subscribe(res => {
      this.floors = res.floors;
      this.availableRooms = []; // Reset rooms when floor changes
    });
  }

/** ✅ Fetch Rooms Based on Selected Hostel, Block, and Floor */
getRooms() {
  const { hostel_id, block_id, floor_id } = this.allocationForm.value;
  if (!hostel_id || !block_id || !floor_id) return;

  this.apiSer.getRoomsByHostelBlockFloor(hostel_id, block_id, floor_id).subscribe(
    res => {
      if (res.success) {
        this.availableRooms = res.rooms;
      } else {
        this.availableRooms = [];
      }
    },
    error => {
      console.error("❌ Error fetching rooms:", error);
    }
  );
}






  /** ✅ Fetch Allocated Rooms */
  getAllocatedRooms() {
    this.apiSer.getAllocatedRooms().subscribe(res => {
      this.allocatedRooms = res.allocatedRooms;
      this.filteredAllocatedRooms = [...this.allocatedRooms]; // Initialize filtered list
      this.totalRecords = this.allocatedRooms.length;
    });
  }

 /**
   * Search Function - Filters all object properties dynamically
   */
 filterAllocatedRooms(): void {
  if (!this.searchText) {
    this.filteredAllocatedRooms = this.allocatedRooms;
  } else {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredAllocatedRooms = this.allocatedRooms.filter(allocation =>
      Object.values(allocation).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
  this.currentPage = 1; // Reset pagination to the first page after filtering
}

/**
 * Display count of currently visible records
 */
displayedRecordsCount(): number {
  return Math.min(this.itemsPerPage, this.filteredAllocatedRooms.length - (this.currentPage - 1) * this.itemsPerPage);
}

/**
 * Handle Page Change
 */
onPageChange(event: number) {
  this.currentPage = event;
}

  /** ✅ Allocate Students */


/** ✅ Allocate Students with Spinner & Notifications */

allocate() {
  if (this.allocationForm.invalid) {
    Swal.fire('⚠️ Warning', 'Please fill all required fields.', 'warning');
    return;
  }

  if (!this.allocationForm.value.selectedStudents || this.allocationForm.value.selectedStudents.length === 0) {
    Swal.fire('⚠️ Warning', 'Please select at least one student.', 'warning');
    return;
  }

  this.spinner.show(); // ✅ Show Spinner

  const allocationData = this.allocationForm.value.selectedStudents.map((selectedStudent: any) => {
    const studentId = selectedStudent.student_id;
    const student = this.students.find((s: any) => s.student_id === studentId);

    if (!student) {
      console.error("❌ Student not found:", selectedStudent);
      return null;
    }

    return {
      student_id: student.student_id,
      username: student.username,
      full_name: student.full_name,
      room_id: this.allocationForm.value.room_id,
      academic_course_year_id: this.allocationForm.value.academic_course_year_id
    };
  }).filter((data: any) => data !== null);

  if (allocationData.length === 0) {
    this.spinner.hide();
    Swal.fire("⚠️ Warning", "No valid students selected for allocation.", "warning");
    return;
  }

  this.apiSer.allocateStudents({ allocations: allocationData }).subscribe(
    (res: any) => {
      this.spinner.hide();
      if (res.success) {
        Swal.fire('✅ Success', 'Students Allocated Successfully!', 'success');
        this.getAllocatedRooms(); // Refresh Allocated Rooms
        this.allocationForm.reset();
      } else {
        Swal.fire('❌ Error', res.message, 'error');
      }
    },
    (error) => {
      this.spinner.hide();
      console.error("❌ Allocation API Error:", error);
      Swal.fire('❌ Error', error.error.message, 'error');
    }
  );
}

}
