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

  selectedUsername: string = ''; // ✅ Track selected student for history

  coursesList: any[] = [];
  availableStudents: any[] = [];
  promotionsList: any[] = [];
  selectedPromotion: any = null;
  addPromotionForm!: FormGroup;
  dropdownSettings: any = {}; // ✅ Multi-select dropdown settings
  academicCourseYears: any[] = [];
  promotionHistory: any[] = []; // ✅ Store Promotion History

  constructor(private fb: FormBuilder, private apiSer: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.addPromotionForm = this.fb.group({
      courseId: [''],
      currentYear: [''], // Stores academic_course_year_id
      selectedStudents: [[]], // ✅ Multi-select students
    });

    this.loadCourses();
    this.loadAcademicCourseYears();
    this.loadPromotions();

    // ✅ Configure Multi-Select Dropdown Settings
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'username', 
      textField: 'full_name', 
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  // ✅ Load Courses
  loadCourses() {
    this.apiSer.getCourses().subscribe(
      (res: any) => {
        if (res?.success && Array.isArray(res.courses)) {
          this.coursesList = res.courses; // ✅ Assign only the `courses` array
        } else {
          console.warn('⚠ No courses found.');
          this.coursesList = [];
        }
        console.log("✅ Loaded Courses:", this.coursesList);
      },
      (error) => {
        console.error("❌ Error fetching courses:", error);
        this.coursesList = []; // Ensure list is empty on error
      }
    );
  }
  

  loadAcademicCourseYears(): void {
    this.apiSer.getAcademicCourseYears().subscribe(
      (res: any) => {
        if (res.success && res.academicYears) {
          // ✅ Filter out "Course Completed" (academic_course_year_id = 5)
          this.academicCourseYears = res.academicYears.filter(
            (year: any) => year.academic_course_year_id !== 5
          );
          console.log("✅ Loaded Academic Course Years (Excluding Course Completed):", this.academicCourseYears);
        } else {
          this.academicCourseYears = [];
          console.error("❌ Failed to load academic course years: No data found");
        }
      },
      (error) => {
        this.academicCourseYears = [];
        console.error("❌ Error fetching academic course years:", error);
      }
    );
  }

  // ✅ Load Students by Selected Course & Year
  loadStudents() {
    const courseId = this.addPromotionForm.value.courseId;
    const yearId = this.addPromotionForm.value.currentYear; 

    if (!courseId || !yearId) {
      console.warn("⚠️ Select both Course and Academic Year before loading students.");
      return;
    }

    this.apiSer.getStudentsByCourseAndYear(courseId, yearId).subscribe(
      (res: any) => {
        if (res.success && res.students.length > 0) {
          this.availableStudents = res.students;
          console.log("✅ Loaded Students:", this.availableStudents);
        } else {
          this.availableStudents = [];
          console.warn("⚠️ No students found for the selected Course and Year.");
        }
      },
      (error) => {
        this.availableStudents = [];
        console.error("❌ Error fetching students by Course and Year:", error);
      }
    );
  }

  // ✅ Submit Promotion using Database Function

// ✅ Submit Promotion using Database Function
submitPromotion() {
  if (this.addPromotionForm.invalid) {
    this.toastr.error('Please fill all fields.');
    return;
  }

  const { selectedStudents, courseId, currentYear } = this.addPromotionForm.value;

  // ✅ Ensure academicCourseYearId is present
  if (!currentYear) {
    this.toastr.error("⚠️ Please select the academic year.");
    return;
  }

  if (!selectedStudents || selectedStudents.length === 0) {
    this.toastr.error("⚠️ No students selected for promotion.");
    return;
  }

  const promotionData = {
    students: selectedStudents.map((student: any) => ({
      username: student.username,
      courseId: courseId,
      academicCourseYearId: currentYear // ✅ Ensure year ID is included
    }))
  };

  console.log("🚀 Submitting Promotion Data:", promotionData);

  this.apiSer.addStudentPromotion(promotionData).subscribe(
    (res: any) => {
      if (res.success) {
        this.toastr.success('✅ Promotion added successfully!');
        this.loadPromotions();
      } else {
        this.toastr.error(res.message || '⚠️ Failed to add promotion.');
      }
    },
    (error) => {
      console.error("❌ Error adding promotion:", error);
      this.toastr.error(error?.error?.message || "Something went wrong. Please try again.");
    }
  );
}



  // ✅ Load Promotions List
  loadPromotions() {
    this.apiSer.getPromotions().subscribe((res: any) => {
      if (res.success) {
        this.promotionsList = res.promotions.map((promotion: any) => ({
          ...promotion,
          updatedCourseYear: promotion.updated_course_year === 'Course Completed' ? '🎓 Course Completed' : promotion.updated_course_year
        }));
      } else {
        this.toastr.error(res.message || 'No promotions found.');
      }
    });
  }

  // ✅ View Promotion Details
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

  // ✅ Get Promotions by Username
  getPromotionsByUsername(username: string) {
    this.apiSer.getPromotionsByUsername(username).subscribe((res: any) => {
      if (res.success) {
        this.promotionsList = res.promotions.map((promotion: any) => ({
          ...promotion,
          updatedCourseYear: promotion.updated_course_year === 'Course Completed' ? '🎓 Course Completed' : promotion.updated_course_year
        }));
      } else {
        this.toastr.error(res.message || 'No promotions found.');
      }
    });
  }

   // ✅ Load Student Promotion History
   loadPromotionHistory(username: string) {
    this.selectedUsername = username; // Store username for modal title
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


}
