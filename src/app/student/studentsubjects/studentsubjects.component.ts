import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-studentsubjects',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './studentsubjects.component.html',
  styleUrl: './studentsubjects.component.scss'
})
export class StudentsubjectsComponent implements OnInit {
  subjectsList: any[] = [];
  username: string | null = null;
  courseId: number | null = null;

  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.loadSubjects();
    
    // ✅ Retrieve values from sessionStorage instead of localStorage
    this.username = sessionStorage.getItem('username');
    this.courseId = Number(sessionStorage.getItem('courseId'));

    if (this.username && this.courseId) {
        this.loadSubjects();
    } else {
        console.error('⚠️ Error: Missing username or courseId in sessionStorage');
    }
}


  loadSubjects(): void {
    this.spinner.show();
    if (this.username && this.courseId) {
      this.apiService.getSubjectsByUsernameAndCourse(this.username, this.courseId).subscribe({
        next: (response) => {
          if (response.success) {
            setTimeout(() => {
              this.spinner.hide(); // ✅ Hide Spinner after timeout
            }, 500); // Hide after 1.5s
            this.subjectsList = response.subjects;
          } else {
            this.spinner.hide();
            console.error('No subjects found:', response.message);
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error fetching subjects:', error);
          this.spinner.hide();
        }
      });
    }
  }
}
