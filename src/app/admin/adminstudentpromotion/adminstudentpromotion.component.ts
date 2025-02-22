import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-adminstudentpromotion',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './adminstudentpromotion.component.html',
  styleUrl: './adminstudentpromotion.component.scss'
})
export class AdminstudentpromotionComponent implements OnInit {

  coursesList: any[] = [];
  availableStudents: any[] = [];
  promotionList: any[] = [];
  selectedPromotion: any = null;
  addPromotionForm!: FormGroup;
  dropdownSettings: any = {}; // ✅ Multi-select dropdown settings


  constructor(private fb: FormBuilder, private apiSer: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.addPromotionForm = this.fb.group({
      courseId: [''],
      currentYear: [''],
      selectedStudents: [[]], // ✅ Multi-select students
      updatedYear: ['']
    });

    this.loadCourses();
    this.loadPromotions();

    // ✅ Configure Multi-Select Dropdown Settings
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'username', // Use 'username' as the unique identifier
      textField: 'full_name', // Display full name in dropdown
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // ✅ Load Courses
  loadCourses() {
    this.apiSer.getCourses().subscribe((res: any) => {
      this.coursesList = res ? res : [];
      console.log("Loaded Courses:", this.coursesList);
    });
  }

  // ✅ Load Students by Selected Course & Year
  loadStudents() {
    const courseId = this.addPromotionForm.value.courseId;
    const currentYear = this.addPromotionForm.value.currentYear;

    if (!courseId || !currentYear) {
      console.log("⚠️ Select both Course and Current Year before loading students.");
      return;
    }

    this.apiSer.getStudentsByCourseAndYear(courseId, currentYear).subscribe((res: any) => {
      this.availableStudents = res.success ? res.students : [];
      console.log("Loaded Students:", this.availableStudents);
    });
  }

  // ✅ Submit Promotion
  submitPromotion() {
    if (this.addPromotionForm.invalid) {
      this.toastr.error('Please fill all fields.');
      return;
    }

    const { courseId, currentYear, selectedStudents, updatedYear } = this.addPromotionForm.value;

    if (currentYear === updatedYear) {
      this.toastr.error('Current Year and Updated Year cannot be the same.');
      return;
    }

    const promotionData = {
      courseId,
      currentYear,
      updatedYear,
      students: selectedStudents.map((student: any) => student.username) // Extract usernames
    };

    this.apiSer.addStudentPromotion(promotionData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Promotion added successfully!');
        this.loadPromotions();
      } else {
        this.toastr.error(res.message || 'Failed to add promotion.');
      }
    });
  }

  // ✅ Load Promotions List
  loadPromotions() {
    this.apiSer.getPromotions().subscribe((res: any) => {
      this.promotionList = res.success ? res.promotions : [];
    });
  }

  viewPromotionDetails(promotionId: number) {
    this.apiSer.getPromotionById(promotionId).subscribe((res: any) => {
      if (res.success) {
        this.selectedPromotion = res.promotion;
      } else {
        this.selectedPromotion = null;
        this.toastr.error("Promotion details not found.");
      }
    });
  }
  

}
