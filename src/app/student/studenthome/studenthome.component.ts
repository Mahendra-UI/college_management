
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import AOS from 'aos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-studenthome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './studenthome.component.html',
  styleUrl: './studenthome.component.scss',
})
export class StudenthomeComponent implements OnInit, AfterViewInit {

  subjectsList: any[] = [];
  username: string | null = null;
  courseId: number | null = null;

  studentDetails: any = null;

  notificationsList: any[] = [];
  roomRequests: any[] = [];
  filteredRequests: any[] = [];



  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide(); // ✅ Hide Spinner after timeout
    }, 500); // Hide after 1.5s
    // AOS.init();

    this.loadNotifications();
    
    // ✅ Retrieve values from sessionStorage instead of localStorage
    this.username = sessionStorage.getItem('username');
    this.courseId = Number(sessionStorage.getItem('courseId'));

    if (this.username) {
        this.loadSubjects();
        this.getStudentMarks(); // ✅ Only this is required now
        this.getStudentRequests();
    } else {
        console.error('⚠️ Error: Missing username or courseId in sessionStorage');
    }
  }
  ngAfterViewInit(): void {
    console.log("Initializing AOS..."); // Debugging
    AOS.init({
      duration: 1000, // Duration of animations in ms
      once: true, // Animation happens only once
    });

    setTimeout(() => {
      console.log("Refreshing AOS...");
      AOS.refresh();
    }, 500); // Ensure reinitialization after view rendering
  }


  //   // ✅ Fetch All Notifications
  loadNotifications(): void {
    this.apiSer.getNotifications().subscribe(response => {
      if (response.success) {
        this.notificationsList = response.notifications;
      } else {
        this.notificationsList = [];
        console.warn("⚠ No notifications found.");
      }
    }, error => {
      console.error("❌ Error fetching notifications:", error);
    });
  }

  loadSubjects(): void {
    this.spinner.show();
    if (this.username && this.courseId) {
      this.apiSer.getSubjectsByUsernameAndCourse(this.username, this.courseId).subscribe({
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


  getStudentMarks(): void {
    if (!this.username) {
      this.toastr.error("Username is not available", "Error");
      return;
    }
  
    this.apiSer.getStudentMarksByUsername(this.username).subscribe(
      (marksResponse) => {
        if (marksResponse?.success === false) {
          this.studentDetails = { marks: [] };
          this.toastr.info(marksResponse.message, "Info");
        } else if (marksResponse?.results?.length > 0) {
          this.studentDetails = {
            ...marksResponse.results[0], // for common info like name, course
            marks: marksResponse.results
          };
          this.toastr.success("Student marks loaded successfully!", "Success");
        } else {
          this.studentDetails = { marks: [] };
          this.toastr.info("No marks available for this student.", "Info");
        }
      },
      (error) => {
        console.error("❌ Error fetching student marks:", error);
        this.toastr.error("Failed to load student marks. Please try again.", "Error");
        this.studentDetails = { marks: [] };
      }
    );
  }
  
  getStudentRequests(): void {
    if (!this.username) {
      console.error("❌ No username found in session storage.");
      return;
    }
  
    console.log("📥 Fetching Room Requests for username:", this.username);
  
    this.apiSer.getStudentRoomRequestsByUsername(this.username.trim()).subscribe(
      (res) => {
        console.log("📜 API Response for Room Requests:", res);
  
        if (res.success && Array.isArray(res.requests)) {
          this.roomRequests = res.requests.map(request => ({
            ...request,
            requested_for: Array.isArray(request.requested_for) ? request.requested_for : []
          }));
  
          this.filteredRequests = [...this.roomRequests]; // ✅ Initialize filtered list
          console.log("✅ Loaded Room Requests:", this.roomRequests);
        } else {
          this.roomRequests = [];
          this.filteredRequests = [];
          console.warn("⚠️ No room requests found.");
          this.toastr.info("No room requests found.", "Info");
        }
      },
      (error) => {
        console.error("❌ Error fetching student room requests:", error);
        this.toastr.error("Failed to load room requests. Please try again later.", "Error");
      }
    );
  }


}
