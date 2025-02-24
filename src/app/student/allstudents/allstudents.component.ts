import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allstudents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './allstudents.component.html',
  styleUrl: './allstudents.component.scss'
})
export class AllstudentsComponent implements OnInit {
  searchText : any = '';
  studentsList: any[] = [];
  coursesList: any[] = [];
  message: string = '';
  studentDetails: any = null;
  studentId: number = 0; // Default student ID

  constructor(private apiSer: ApiService) {

  }
  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }
  /**
 * Load all students
 */
loadStudents(): void {
  this.apiSer.getStudents(0).subscribe(
    (data) => {
      this.studentsList = data;
    },
    (error) => {
      console.error('Error fetching students', error);
    }
  );
}
  /**
   * ✅ Fetch Student Details by Username and Show in Modal
   * @param username The username of the student (e.g., B1000)
   */
getStudentDetails(username: string): void {
  this.apiSer.getStudentByUsername(username).subscribe(
    (data) => {
      this.studentDetails = data;
    },
    (error) => {
      console.error('❌ Error fetching student details', error);
    }
  );
}
  /**
   * Load courses
   */
  loadCourses(): void {
    this.apiSer.getCourses().subscribe(
      (res: any) => {
        if (res?.success && Array.isArray(res.courses)) {
          this.coursesList = res.courses; // ✅ Extracts and assigns only the `courses` array
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
  
}
