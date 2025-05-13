// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { ApiService } from '../../services/api.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
// import { FormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';

// @Component({
//   selector: 'app-adminfeeinfo',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
//   templateUrl: './adminfeeinfo.component.html',
//   styleUrl: './adminfeeinfo.component.scss'
// })
// export class AdminfeeinfoComponent implements OnInit {

//   feeStatusList: any[] = [];


//   filteredFeeStatusList: any[] = [];
//   searchText: string = '';
//   itemsPerPage: number = 50; // Number of records per page
//   currentPage: number = 1;
//   totalRecords: number = 0;

//   constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toaster: ToastrService) {

//   }
//   ngOnInit(): void {
//     this.loadFeeStatus();
//   }

// /** ✅ Load All Students' Fee Status */
// loadFeeStatus() {
//   this.apiSer.getAllStudentsFeeStatus().subscribe((res: any) => {
//     if (res.success) {
//       this.feeStatusList = res.feeStatus;
//       this.filteredFeeStatusList = [...this.feeStatusList]; // Initialize filtered list
//       this.totalRecords = this.feeStatusList.length;
//     } else {
//       console.error('No Fee Status found:', res.message);
//     }
//   });
// }

// filterFeeList(): void {
//   if (!this.searchText) {
//     this.filteredFeeStatusList = this.feeStatusList;
//   } else {
//     const searchTerm = this.searchText.toLowerCase();
//     this.filteredFeeStatusList = this.feeStatusList.filter(fee =>
//       Object.values(fee).some(value =>
//         value && value.toString().toLowerCase().includes(searchTerm)
//       )
//     );
//   }
//   this.currentPage = 1; // Reset pagination to the first page after filtering
// }

// displayedRecordsCount(): number {
//   return Math.min(this.itemsPerPage, this.filteredFeeStatusList.length - (this.currentPage - 1) * this.itemsPerPage);
// }

// onPageChange(event: number) {
//   this.currentPage = event;
// }
// }




import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-adminfeeinfo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './adminfeeinfo.component.html',
  styleUrls: ['./adminfeeinfo.component.scss']
})
export class AdminfeeinfoComponent implements OnInit {

  feeStatusList: any[] = [];
  filteredFeeStatusList: any[] = [];
  searchText: string = '';
  itemsPerPage: number = 50; // Number of records per page
  currentPage: number = 1;
  totalRecords: number = 0;

  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.loadFeeStatus();
  }

  /** ✅ Load All Students' Fee Status */
  loadFeeStatus() {
    this.apiSer.getAllStudentsFeeStatus().subscribe((res: any) => {
      if (res.success) {
        this.feeStatusList = res.feeStatus;
        this.filterFeeStatus(); // Filter the list when the data is loaded
        this.totalRecords = this.filteredFeeStatusList.length;
      } else {
        console.error('No Fee Status found:', res.message);
      }
    });
  }

  filterFeeStatus() {
    const uniqueRecords: any[] = [];
    const userSemesterFeeTypeMap: Map<string, boolean> = new Map(); // Track unique student-semester-fee_type combinations

    this.feeStatusList.forEach(fee => {
      const key = `${fee.student_username}-${fee.semester_name}-${fee.fee_type_name}`;
      if (!userSemesterFeeTypeMap.has(key)) {
        userSemesterFeeTypeMap.set(key, true);
        uniqueRecords.push(fee);
      }
    });

    this.filteredFeeStatusList = uniqueRecords;
  }

  filterFeeList(): void {
    if (!this.searchText) {
      this.filterFeeStatus(); // Reset the filter to the unique list when the search is cleared
    } else {
      const searchTerm = this.searchText.toLowerCase();
      this.filteredFeeStatusList = this.feeStatusList.filter(fee =>
        Object.values(fee).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }
    this.currentPage = 1; // Reset pagination to the first page after filtering
  }

  displayedRecordsCount(): number {
    return Math.min(this.itemsPerPage, this.filteredFeeStatusList.length - (this.currentPage - 1) * this.itemsPerPage);
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }
}
