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

}
