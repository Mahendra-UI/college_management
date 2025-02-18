import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-studentresults',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './studentresults.component.html',
  styleUrl: './studentresults.component.scss'
})
export class StudentresultsComponent implements OnInit {
  subjectsList: any[] = [];
  resultsList: any[] = [];
  username: string | null = null;
  courseId: number | null = null;

  // courseName: string = 'Loading...';
  courseName: string | null = null;
  semesterName: string = 'Loading...';

  semesters: any[] = [];
  selectedSemester: number = 1; // ✅ Default to Semester 1

  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    // ✅ Retrieve values from sessionStorage instead of localStorage
    this.username = sessionStorage.getItem('username');
    this.courseName = sessionStorage.getItem('course_name');

    console.log(this.courseName, "session storage course name");
    
    this.courseId = Number(sessionStorage.getItem('courseId'));

    if (this.username && this.courseId) {
        this.loadSubjects();
        this.loadSemesters(() => {
            this.onSemesterChange(); // ✅ Automatically loads first semester results
        });
    } else {
        console.error('⚠️ Error: Missing username or courseId in sessionStorage');
    }
}


  loadSubjects(): void {
    if (this.username && this.courseId) {
      this.apiService.getSubjectsByUsernameAndCourse(this.username, this.courseId).subscribe({
        next: (response) => {
          if (response.success) {
            this.subjectsList = response.subjects;
          } else {
            console.error('No subjects found:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching subjects:', error);
        }
      });
    }
  }

  loadSemesters(callback?: () => void): void {
    this.apiService.getSemesters().subscribe({
      next: (response) => {
        if (response.success) {
          this.semesters = response.semesters;
          console.log('✅ Semesters Loaded:', this.semesters);

          if (callback) {
            callback();
          }
        }
      },
      error: (error) => {
        console.error('❌ Error fetching semesters:', error);
      }
    });
  }

  onSemesterChange(): void {
    this.spinner.show();
    
    if (this.username && this.selectedSemester) {
        console.log(`📩 Fetching results for Semester: ${this.selectedSemester}`);

        // Find the selected semester name
        const selectedSemObj = this.semesters.find(sem => sem.semester_id == this.selectedSemester);
        this.semesterName = selectedSemObj ? selectedSemObj.semester_name : 'Unknown Semester';

        this.apiService.getStudentResultsBySemester(this.username, this.selectedSemester).subscribe({
            next: (response) => {
                if (response.success && response.results.length > 0) {
                  setTimeout(() => {
                    this.spinner.hide(); // ✅ Hide Spinner after timeout
                  }, 500); // Hide after 1.5s
                    this.resultsList = response.results;
                    this.courseName = this.resultsList[0].course_name; // ✅ Set course name from first result
                    console.log("✅ Results Updated:", this.resultsList);
                } else {
                    this.resultsList = []; // ✅ Ensure list is empty if no results
                    console.warn("⚠ No results found for this semester.");
                }
            },
            error: (error) => {
              console.error("❌ Error fetching student results:", error);
              this.resultsList = [];
              setTimeout(() => {
                this.spinner.hide(); // ✅ Hide Spinner after timeout
              }, 500); // Hide after 1.5s
            },
            complete: () => {
              setTimeout(() => {
                this.spinner.hide(); // ✅ Hide Spinner after timeout
              }, 500); // Hide after 1.5s
            }
        });
    }
}


  onSemesterChangeold(): void {
    this.spinner.show();
    if (this.username && this.selectedSemester) {
      console.log(`📩 Fetching results for Semester: ${this.selectedSemester}`);

      // Find the selected semester name
      const selectedSemObj = this.semesters.find(sem => sem.semester_id == this.selectedSemester);
      this.semesterName = selectedSemObj ? selectedSemObj.semester_name : 'Unknown Semester';

      this.apiService.getStudentResultsBySemester(this.username, this.selectedSemester).subscribe({
        next: (response) => {
          if (response.success) {
            setTimeout(() => {
              this.spinner.hide(); // ✅ Hide Spinner after timeout
            }, 500); // Hide after 1.5s
            this.resultsList = response.results;

            // ✅ Set Course Name if results exist
            if (this.resultsList.length > 0) {
              this.courseName = this.resultsList[0].course_name;
            }

            console.log("✅ Results Updated:", this.resultsList);
          } else {
            // ✅ Keep the Course Name even if no results
            this.spinner.hide();
            this.resultsList = [];
            console.warn("⚠ No results found for this semester.");
          }
        },
        error: (error) => {
          console.error("❌ Error fetching student results:", error);
          this.resultsList = [];
        }
      });
    }
  }
}
