import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-studentresults',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './studentresults.component.html',
  styleUrl: './studentresults.component.scss'
})
export class StudentresultsComponent implements OnInit {


  cgpa: number | null = null;
  studentDetails: any = null;
  currentSGPA: number | null = null;
  


  username: string | null = null;
  courseId: number | null = null;
  courseName: string | null = null;
  semesterName: string = '';

  semesters: any[] = [];
  selectedSemester: number | null = null;
  resultsList: any[] = [];

  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.courseName = sessionStorage.getItem('course_name');
    this.courseId = Number(sessionStorage.getItem('courseId'));

    if (this.username && this.courseId) {
      this.getStudentDetails(this.username);
      this.loadSemesters();
    } else {
      console.error('⚠️ Error: Missing username or courseId in sessionStorage');
    }
  }



  loadSemesters(): void {
    this.apiService.getSemesters().subscribe({
      next: (response) => {
        if (response.success && response.semesters.length > 0) {
          this.semesters = response.semesters;

          // ✅ Select the first semester only if selectedSemester is null
          if (!this.selectedSemester) {
            this.selectedSemester = this.semesters[0].semester_id;
          }

          // ✅ Update semester name
          this.updateSemesterName();

          // ✅ Load initial semester data
          this.onSemesterChange();
        } else {
          console.warn('⚠ No semesters found.');
          this.semesterName = 'N/A';
        }
      },
      error: (error) => {
        console.error('❌ Error fetching semesters:', error);
      }
    });
  }

  onSemesterChange(): void {
    if (!this.username || !this.selectedSemester) return;
  
    this.updateSemesterName();
    this.updateSemesterSGPA();  // 🔁 Add this to update SGPA for the selected semester
  
    this.spinner.show();
    this.apiService.getStudentResultsBySemester(this.username, this.selectedSemester).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.resultsList = response.success ? response.results : [];
  
        if (this.resultsList.length === 0) {
          console.warn("⚠ No results found for selected semester.");
        }
      },
      error: (error) => {
        console.error("❌ Error fetching student results:", error);
        this.resultsList = [];
        this.spinner.hide();
      }
    });
  }
  

  onSemesterChangeold(): void {
    if (!this.username || !this.selectedSemester) return;

    console.log(`📩 Semester changed: ${this.selectedSemester}`);

    // ✅ Update semester name first
    this.updateSemesterName();

    this.spinner.show();

    this.apiService.getStudentResultsBySemester(this.username, this.selectedSemester).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.resultsList = response.success ? response.results : [];
        console.log("✅ Results Updated:", this.resultsList);

        if (this.resultsList.length === 0) {
          console.warn("⚠ No results found for selected semester.");
        }
      },
      error: (error) => {
        console.error("❌ Error fetching student results:", error);
        this.resultsList = [];
        this.spinner.hide();
      }
    });

    // ✅ Ensure UI updates correctly
    setTimeout(() => {
      console.log(`✅ Semester Name Final: ${this.semesterName}`);
    });
  }

  updateSemesterName(): void {
    console.log(`📌 Finding semester name for ID: ${this.selectedSemester}, Type: ${typeof this.selectedSemester}`);

    // ✅ Ensure selectedSemester is a number
    const selectedSemesterId = Number(this.selectedSemester);

    // ✅ Find the matching semester in the array
    const selectedSemObj = this.semesters.find(sem => sem.semester_id === selectedSemesterId);

    if (selectedSemObj) {
        this.semesterName = selectedSemObj.semester_name;
        console.log("✅ Semester Name Updated:", this.semesterName);
    } else {
        this.semesterName = 'N/A';
        console.warn("⚠ Semester name not found. Keeping last known value.");
    }
}


getStudentDetails(username: string): void {
  this.apiService.getStudentByUsername(username).subscribe(
    (response) => {
      if (response.success) {
        this.studentDetails = response.student;
        this.cgpa = Number(response.student.cgpa) || 0;  // ✅ Set fixed CGPA
        this.updateSemesterSGPA();  // Load SGPA based on selected semester
      }
    },
    (error) => {
      console.error('❌ Error fetching student details', error);
    }
  );
}



updateSemesterSGPA(): void {
  if (!this.studentDetails || !this.selectedSemester) {
    this.currentSGPA = null;
    return;
  }

  const semFieldMap: { [key: number]: string } = {
    1: 'first_semester_sgpa',
    2: 'second_semester_sgpa',
    3: 'third_semester_sgpa',
    4: 'fourth_semester_sgpa',
    5: 'fifth_semester_sgpa',
    6: 'sixth_semester_sgpa',
    7: 'seventh_semester_sgpa',
    8: 'eighth_semester_sgpa',
  };

  const sgpaField = semFieldMap[this.selectedSemester];
  this.currentSGPA = sgpaField ? Number(this.studentDetails[sgpaField]) || 0 : null;
}


}
