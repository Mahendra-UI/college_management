import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-managenotifications',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './managenotifications.component.html',
  styleUrl: './managenotifications.component.scss'
})
export class ManagenotificationsComponent implements OnInit {

  filteredNotifications: any[] = []; // Filtered Data for Search
  searchText: string = ''; 
  itemsPerPage: number = 5;
  currentPage: number = 1;


  notificationForm!: FormGroup;
  notifications: any[] = [];
  isEditing: boolean = false;
  editNotificationId: number | null = null;
  selectedNotification: any = null; // ✅ To display notification details

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
      private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      title_description: ['', Validators.required]
    });

    this.loadNotifications();
  }

  // ✅ Fetch All Notifications
  loadNotifications(): void {
    this.spinner.show();
    this.apiService.getNotifications().subscribe(response => {
      setTimeout(() => {
        this.spinner.hide(); // ✅ Hide Spinner after timeout
      }, 500); // Hide after 1.5s
      console.log('Notifications Loaded Successfully:', response);
      if (response.success) {
        setTimeout(() => {
          this.spinner.hide();
          // this.toastr.success('Notifications Loaded Successfully ✅', 'Success');
        }, 400);
        this.notifications = response.notifications;
        this.filteredNotifications = response.notifications; // Initialize filtered list
      } else {
        this.notifications = [];
        console.warn("⚠ No notifications found.");
      }
    }, error => {
      this.spinner.hide();
      console.error("❌ Error fetching notifications:", error);
    });
  }

  /**
   * Search Function - Filters dynamically across all object properties
   */
  filterNotifications(): void {
    if (!this.searchText) {
      this.filteredNotifications = this.notifications;
      return;
    }
    
    const searchTerm = this.searchText.toLowerCase();
    this.filteredNotifications = this.notifications.filter(notification =>
      Object.values(notification).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }

  /**
   * Display count of currently visible records
   */
  displayedRecordsCount(): number {
    return Math.min(this.itemsPerPage, this.filteredNotifications.length - (this.currentPage - 1) * this.itemsPerPage);
  }

  /**
   * Handle Page Change
   */
  onPageChange(event: number) {
    this.currentPage = event;
  }

  // ✅ Fetch Notification by ID (View Notification)
  viewNotificationold(notificationId: number): void {
    this.apiService.getNotificationById(notificationId).subscribe(response => {
      if (response.success) {
        this.selectedNotification = response.notification;
      } else {
        alert("⚠ Notification not found.");
        this.selectedNotification = null;
      }
    }, error => {
      console.error("❌ Error fetching notification:", error);
      alert("❌ Error fetching notification.");
    });
  }

  resetForm() {
    this.notificationForm.reset();
    this.isEditing = false;
    this.editNotificationId = null;
  }
  // ✅ Submit or Update Notification
  onSubmit(): void {
    if (this.notificationForm.valid) {
      const notificationData = this.notificationForm.value;

      if (this.isEditing && this.editNotificationId) {
        // Update Notification
        this.apiService.updateNotification(this.editNotificationId, notificationData).subscribe(response => {
          this.isEditing = false;
          this.editNotificationId = null;
          this.loadNotifications();
          this.notificationForm.reset();
          Swal.fire("✅ Success", "Notification Updated Successfully!", "success");
          // alert("✅ Notification Updated Successfully!");
        }, error => {
          alert("❌ Error updating notification.");
        });
      } else {
        // Add Notification
        this.apiService.addNotification(notificationData).subscribe(response => {
          if (response.success) {
          this.loadNotifications();
          this.notificationForm.reset();
          Swal.fire("✅ Success", "Notification Submitted Successfully!", "success");
          } else {
            Swal.fire("❌ Error", response.message, "error");
          }
          // alert("✅ Notification Submitted Successfully!");
        }, 
        error => {
          console.error("❌ API Error:", error);
          Swal.fire("❌ API Error", error.message, "error");
          // Swal.fire("❌ Error", response.message, "error");
          // alert("❌ Error submitting notification.");
        });
      }
    }
  }


  viewNotification(notificationId: number): void {
    this.apiService.getNotificationById(notificationId).subscribe(
      (response) => {
        if (response.success) {
          this.selectedNotification = response.notification;
          console.log("✅ Notification Details Loaded:", this.selectedNotification);
        } else {
          alert("⚠ Notification not found.");
          this.selectedNotification = null;
        }
      },
      (error) => {
        console.error("❌ Error fetching notification:", error);
          Swal.fire("❌ Error fetching notification");

        // alert("❌ Error fetching notification.");
      }
    );
  }
  
  editNotification(notificationId: number): void {
    this.isEditing = true;
    this.editNotificationId = notificationId;
  
    // ✅ Fetch latest notification details from API before updating the form
    this.apiService.getNotificationById(notificationId).subscribe(
      (response) => {
        if (response.success) {
          const notification = response.notification;
  
          // ✅ Bind fetched notification data to form
          this.notificationForm.patchValue({
            title: notification.title,
            title_description: notification.title_description
          });
  
          console.log("✅ Edit Notification Data Bound:", this.notificationForm.value);
        } else {
          console.warn("⚠ Notification not found.");
        }
      },
      (error) => {
        console.error("❌ Error fetching notification:", error);
      }
    );
  }
  

  // ✅ Edit Notification
  editNotificationold(notification: any): void {
    this.isEditing = true;
    this.editNotificationId = notification.notification_id;
    this.notificationForm.patchValue({
      title: notification.title,
      title_description: notification.title_description
    });
  }

  deleteNotification(notificationId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this notification!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteNotification(notificationId).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire('Deleted!', 'Notification has been deleted.', 'success');
              this.notifications = this.notifications.filter((n) => n.notification_id !== notificationId);
            } else {
              Swal.fire('Error!', response.message, 'error');
            }
          },
          (error) => {
            console.error("❌ Error deleting notification:", error);
            Swal.fire('Error!', 'Failed to delete notification.', 'error');
          }
        );
      }
    });
  }

}
