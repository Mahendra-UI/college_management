// import { CommonModule } from '@angular/common';
// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import AOS from 'aos';
// import { ApiService } from '../../services/api.service';
// import { ChartModule } from 'primeng/chart';
// import Chart from 'chart.js/auto'; // ✅ Required for PrimeNG Charts

// @Component({
//   selector: 'app-adminhome',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ChartModule], // ✅ Import ChartModule
//   templateUrl: './adminhome.component.html',
//   styleUrl: './adminhome.component.scss'
// })
// export class AdminhomeComponent implements OnInit, AfterViewInit {
//   studentsList: any[] = [];
//   subjectsList: any[] = [];
//   selectedCourseId: number = 0;
//   selectedSemesterId: number = 0;
//   notificationsList: any[] = [];
//   studentResultsList: any[] = [];
//   chartData: any;
//   chartOptions: any;

//   courseMasters: any[] = [
//     { "course_id": 1, "course_name": "CSE", "course_branch": "Computer Science Engineering" },
//     { "course_id": 2, "course_name": "ETC", "course_branch": "Electronics and Telecommunication Engineering" },
//     { "course_id": 3, "course_name": "EEE", "course_branch": "Electrical and Electronics Engineering" },
//     { "course_id": 4, "course_name": "IT", "course_branch": "Information Technology" },
//     { "course_id": 5, "course_name": "CE", "course_branch": "Computer Engineering" }
//   ];

//   constructor(private apiSer: ApiService) {}

//   ngOnInit(): void {
//     this.loadStudents();
//     this.loadSubjects();
//     this.loadNotifications();
//     this.loadStudentResults();
//     this.initializeChartOptions();
//   }

//   ngAfterViewInit(): void {
//     console.log("Initializing AOS...");
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });

//     setTimeout(() => {
//       console.log("Refreshing AOS...");
//       AOS.refresh();
//     }, 500);
//   }

//   loadStudents(): void {
//     this.apiSer.getStudents(0).subscribe(
//       (data) => {
//         this.studentsList = data;
//         this.prepareChartData(); // Prepare chart after data load
//       },
//       (error) => {
//         console.error('Error fetching students', error);
//       }
//     );
//   }

//   // ✅ Prepare Data for Vertical Bar Chart
//   prepareChartData(): void {
//     const courseCounts: { [key: string]: number } = {};

//     // Initialize counts for each course
//     this.courseMasters.forEach(course => {
//       courseCounts[course.course_name] = 0;
//     });

//     // Count students per course
//     this.studentsList.forEach(student => {
//       if (courseCounts.hasOwnProperty(student.course_name)) {
//         courseCounts[student.course_name]++;
//       }
//     });

//     // Extract labels and values
//     const labels = Object.keys(courseCounts);
//     const values = Object.values(courseCounts);

//     // ✅ PrimeNG Chart Data Format (Vertical Bar Chart)
//     this.chartData = {
//       labels: labels,
//       datasets: [
//         {
//           label: 'Number of Students',
//           backgroundColor: '#42A5F5',
//           borderColor: '#1E88E5',
//           data: values,
//           borderWidth: 1
//         }
//       ]
//     };
//   }

//   // ✅ Set Chart Options for Vertical Bar Chart
//   initializeChartOptions(): void {
//     this.chartOptions = {
//       indexAxis: 'x', // ✅ This ensures a **vertical** bar chart
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           ticks: {
//             stepSize: 1 // Ensure the count increments properly
//           }
//         },
//         x: {
//           grid: {
//             display: false // Hide vertical grid lines
//           }
//         }
//       }
//     };
//   }

//   loadSubjects() {
//     console.log(`📡 Fetching subjects for Course ID: ${this.selectedCourseId}, Semester ID: ${this.selectedSemesterId}`);
//     this.apiSer.getSubjects(this.selectedCourseId, this.selectedSemesterId).subscribe(
//       (data: any) => {
//         console.log("✅ Subjects List:", data.subjects);
//         this.subjectsList = data.subjects;
//       },
//       error => console.error("❌ Error fetching subjects:", error)
//     );
//   }

//   // ✅ Fetch All Notifications
//   loadNotifications(): void {
//     this.apiSer.getNotifications().subscribe(response => {
//       if (response.success) {
//         this.notificationsList = response.notifications;
//       } else {
//         this.notificationsList = [];
//         console.warn("⚠ No notifications found.");
//       }
//     }, error => {
//       console.error("❌ Error fetching notifications:", error);
//     });
//   }

//   loadStudentResults() {
//     this.apiSer.getStudentResults().subscribe(response => {
//         if (response.success) {
//             this.studentResultsList = response.results;
//             console.log("✅ Student Results Loaded:", this.studentResultsList);
//         } else {
//             console.warn("⚠ No student results found.");
//             this.studentResultsList = [];
//         }
//     }, error => {
//         console.error("❌ Error Fetching Student Results:", error);
//     });
//   }
// }


import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';
import AOS from 'aos';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-adminhome',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule], 
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.scss'
})
export class AdminhomeComponent implements OnInit, AfterViewInit {
  studentsList: any[] = [];
  coursesList: any[] = [];
  semestersList: any[] = [];
  subjectsList: any[] = [];
  studentResultsList: any[] = [];
  notificationsList: any[] = [];

  pieChartData: any;
  pieChartOptions: any;
  subjectsBarChartData: any;
  studentsBarChartData: any;
  barChartOptions: any;

  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide(); // ✅ Hide Spinner after timeout
    }, 500); // Hide after 1.5s
    this.loadStudentResults();
    this.loadNotifications();
    this.loadCourses(() => {
      this.loadSemesters(() => {
        this.loadSubjects();
        this.loadStudents();
      });
    });

    this.initializeChartOptions();
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
        this.coursesList = data;
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
        this.prepareSubjectsBarChartData();
      },
      (error) => console.error("❌ Error fetching subjects:", error)
    );
  }

  /** ✅ Load Students */
  loadStudents(): void {
    this.apiSer.getStudents(0).subscribe(
      (data) => {
        this.studentsList = data;
        this.preparePieChartData();  // ✅ Fixed missing function
        this.prepareStudentsBarChartData();
      },
      (error) => console.error('❌ Error fetching students', error)
    );
  }

  /** ✅ Prepare Pie Chart Data (Students per Course) */
  preparePieChartData(): void {
    const courseCounts: { [key: string]: number } = {};

    this.coursesList.forEach(course => {
      courseCounts[course.course_name] = 0;
    });

    this.studentsList.forEach(student => {
      if (courseCounts.hasOwnProperty(student.course_name)) {
        courseCounts[student.course_name]++;
      }
    });

    const labels = Object.keys(courseCounts);
    const values = Object.values(courseCounts);

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Students per Course',
          data: values,
          backgroundColor: labels.map(course => courseColors[course] || '#000000'),
          hoverBackgroundColor: labels.map(course => courseColors[course] || '#000000')
        }
      ]
    };

    console.log("✅ Pie Chart Data:", this.pieChartData);
  }

  /** ✅ Prepare Stacked Bar Chart Data (Subjects per Semester per Course) */
  prepareSubjectsBarChartData(): void {
    const subjectCounts: { [course: string]: { [semester: string]: number } } = {};

    this.coursesList.forEach(course => {
      subjectCounts[course.course_name] = {};
      this.semestersList.forEach(semester => {
        subjectCounts[course.course_name][semester.semester_name] = 0;
      });
    });

    this.subjectsList.forEach(subject => {
      if (subjectCounts[subject.course_name]) {
        subjectCounts[subject.course_name][subject.semester_name]++;
      }
    });

    const labels = this.coursesList.map(course => course.course_name);
    const datasets = this.semestersList.map(semester => ({
      label: semester.semester_name,
      backgroundColor: semesterColors[semester.semester_name] || '#000000', 
      data: labels.map(course => subjectCounts[course][semester.semester_name] || 0)
    }));

    this.subjectsBarChartData = {
      labels: labels,
      datasets: datasets
    };

    console.log("✅ Subjects Bar Chart Data:", this.subjectsBarChartData);
  }

/** ✅ Prepare Stacked Bar Chart Data (Students per Semester per Course) */
prepareStudentsBarChartData(): void {
  const studentCounts: { [course: string]: { [semester: string]: number } } = {};

  // ✅ Initialize course and semester structure
  this.coursesList.forEach(course => {
      studentCounts[course.course_name] = {};
      this.semestersList.forEach(semester => {
          studentCounts[course.course_name][semester.semester_name] = 0;
      });
  });

  // ✅ Count students per course per semester (Dynamically Mapping Semester Name)
  this.studentsList.forEach(student => {
      const semesterName = `Semester - ${this.getSemesterNumber(student.enrollment_year)}`;
      
      if (studentCounts[student.course_name] && semesterName) {
          if (!studentCounts[student.course_name][semesterName]) {
              studentCounts[student.course_name][semesterName] = 0;
          }
          studentCounts[student.course_name][semesterName]++;  // ✅ Increment student count
      }
  });

  // ✅ Extract labels (courses) and datasets (semesters with counts)
  const labels = this.coursesList.map(course => course.course_name);
  const datasets = this.semestersList.map(semester => ({
      label: semester.semester_name,
      backgroundColor: semesterColors[semester.semester_name] || '#000000',
      data: labels.map(course => studentCounts[course][semester.semester_name] || 0)
  }));

  this.studentsBarChartData = {
      labels: labels,
      datasets: datasets
  };

  console.log("✅ Fixed Students Bar Chart Data:", this.studentsBarChartData);
}

/** ✅ Convert Enrollment Year to Semester Number */
getSemesterNumber(enrollmentYear: number): number {
  const currentYear = new Date().getFullYear();
  const yearDiff = currentYear - enrollmentYear;
  
  // Assuming each academic year has 2 semesters
  return yearDiff * 2 + 1;  // Example: If enrolled in 2024, first semester (1)
}



  /** ✅ Chart Options */
  initializeChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          beginAtZero: true,
          stacked: true
        }
      }
    };
  }
}

/** 🎨 **Static Colors for Semesters** */
const semesterColors: { [key: string]: string } = {
  'Semester - I': '#42A5F5',  
  'Semester - II': '#66BB6A', 
  'Semester - III': '#FFA726', 
  'Semester - IV': '#D81B60', 
  'Semester - V': '#8E24AA', 
  'Semester - VI': '#AB47BC', 
  'Semester - VII': '#FF7043', 
  'Semester - VIII': '#5D4037' 
};

/** 🎨 **Static Colors for Courses** */
const courseColors: { [key: string]: string } = {
  'CSE': '#FF5733',  
  'ETC': '#33FF57',  
  'EEE': '#33A5FF',  
  'IT': '#FF33A5',   
  'CE': '#A533FF'    
};
