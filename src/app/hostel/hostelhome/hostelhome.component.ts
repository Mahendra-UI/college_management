import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import AOS from 'aos';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hostelhome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostelhome.component.html',
  styleUrl: './hostelhome.component.scss'
})
export class HostelhomeComponent implements OnInit, AfterViewInit {

  studentsList: any[] = [];
  coursesList: any[] = [];
  semestersList: any[] = [];
  subjectsList: any[] = [];
  studentResultsList: any[] = [];
  notificationsList: any[] = [];


  totalRooms: number = 0;
  totalAllocatedRooms: number = 0;
  totalAvailableRooms: number = 0;
  roomsList: any[] = [];


  allocatedRooms: any[] = [];
  roomRequests: any[] = [];
  roomRequestsAllocations: any[] = [];



  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide(); // ✅ Hide Spinner after timeout
    }, 500); // Hide after 1.5s
    this.getAllRooms();
    this.fetchAllocatedRooms();
    this.loadRoomRequests();
    this.loadRoomRequestsAllocations();
    this.loadStudentResults();
    this.loadNotifications();
    this.loadCourses(() => {
      this.loadSemesters(() => {
        this.loadSubjects();
        this.loadStudents();
      });
    });
  }

  /**
   * Fetch Allocated Rooms Data
   */
fetchAllocatedRooms() {
  this.apiSer.getAllocatedRooms().subscribe(
    (res) => {
      if (res.success) {
        this.allocatedRooms = res.allocatedRooms.filter((room:any) => room.status === 'Allocated');
        // this.allocatedRooms = res.allocatedRooms.filter((room:any) => room.status === 'Inactive');
      }
    },
    (err) => console.error('Failed to fetch allocated rooms:', err)
  );
}


loadRoomRequests(): void {
  this.spinner.show();
  this.apiSer.getRoomRequests().subscribe(
    (res) => {
      this.spinner.hide();
      if (res.success) {
        this.roomRequests = res.requests.filter((room: any) => room.status === 'Pending');
        // this.allocatedRooms = res.allocatedRooms.filter((room:any) => room.status === 'Allocated');

      } else {
        this.toastr.info("No room requests found.", "Info");
        this.roomRequests = [];
      }
    },
    (error) => {
      this.spinner.hide();
      console.error("❌ Error fetching room requests:", error);
      this.toastr.error("Failed to load requests.", "Error");
    }
  );
}

loadRoomRequestsAllocations(): void {
  this.spinner.show();
  this.apiSer.getRoomRequests().subscribe(
    (res) => {
      this.spinner.hide();
      if (res.success) {
        // this.roomRequestsAllocations = res.requests;
        this.roomRequestsAllocations = res.requests.filter((room: any) => room.status === 'Approved');

      } else {
        this.toastr.info("No room requests found.", "Info");
        this.roomRequestsAllocations = [];
      }
    },
    (error) => {
      this.spinner.hide();
      console.error("❌ Error fetching room requests:", error);
      this.toastr.error("Failed to load requests.", "Error");
    }
  );
}

  getAllRooms() {
    this.spinner.show();
    this.apiSer.getAvailableRooms().subscribe(
      (res) => {
        if (res.success) {
          this.roomsList = res.rooms;

          // ✅ Correct calculations
          this.totalRooms = this.roomsList.length;
          this.totalAllocatedRooms = this.roomsList.reduce(
            (sum, room) => sum + (room.total_seats - room.available_seats), 0
          );
          this.totalAvailableRooms = this.roomsList.reduce(
            (sum, room) => sum + room.available_seats, 0
          );

          // this.filteredRooms = [...this.roomsList]; // ✅ Initialize filtered list
        } else {
          this.toastr.warning('No rooms data found.', 'Warning');
          this.roomsList = [];
          this.totalRooms = 0;
          this.totalAllocatedRooms = 0;
          this.totalAvailableRooms = 0;
        }
        this.spinner.hide();
      },
      () => {
        this.toastr.error('Failed to fetch available rooms!', 'Error');
        this.roomsList = [];
        this.totalRooms = 0;
        this.totalAllocatedRooms = 0;
        this.totalAvailableRooms = 0;
        this.spinner.hide();
      }
    );
  }

  ngAfterViewInit(): void {
    console.log("Initializing AOS...");
    AOS.init({
      duration: 1000,
      once: true,
    });

    setTimeout(() => {
      console.log("Refreshing AOS...");
      AOS.refresh();
    }, 500);
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
  
  loadStudentResults() {
    this.apiSer.getStudentResults().subscribe(response => {
        if (response.success) {
            this.studentResultsList = response.results;
            console.log("✅ Student Results Loaded:", this.studentResultsList);
        } else {
            console.warn("⚠ No student results found.");
            this.studentResultsList = [];
        }
    }, error => {
        console.error("❌ Error Fetching Student Results:", error);
    });
  }
  
  
    /** ✅ Load Courses */
    loadCourses(callback?: () => void) {
      this.apiSer.getCourses().subscribe(
        (data) => {
          this.coursesList = data.courses;
          console.log("✅ Courses Loaded:", this.coursesList);
          if (callback) callback();
        },
        (error) => console.error('❌ Error fetching courses', error)
      );
    }
  
    /** ✅ Load Semesters */
    loadSemesters(callback?: () => void) {
      this.apiSer.getSemesters().subscribe(
        (data) => {
          this.semestersList = data.semesters;
          console.log("✅ Semesters Loaded:", this.semestersList);
          if (callback) callback();
        },
        (error) => console.error('❌ Error fetching semesters', error)
      );
    }
  
    /** ✅ Load Subjects */
    loadSubjects() {
      this.apiSer.getSubjects(0, 0).subscribe(
        (data: any) => {
          if (Array.isArray(data)) {
            this.subjectsList = data;
          } else if (data?.subjects) {
            this.subjectsList = data.subjects;
          } else {
            console.warn("⚠ Unexpected subjects API response:", data);
            this.subjectsList = [];
          }
  
          console.log("✅ Subjects List:", this.subjectsList);
        },
        (error) => console.error("❌ Error fetching subjects:", error)
      );
    }
  
    /** ✅ Load Students */
    loadStudents(): void {
      this.apiSer.getStudents(0).subscribe(
        (data) => {
          this.studentsList = data.students;
        },
        (error) => console.error('❌ Error fetching students', error)
      );
    }

}
