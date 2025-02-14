import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  selectedNotification: any = null; // ✅ To display notification details


  constructor(private apiSer: ApiService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }
    // ✅ Fetch All Notifications
    loadNotifications(): void {
      this.spinner.show();
      this.apiSer.getNotifications().subscribe(response => {
        if (response.success) {
          setTimeout(() => {
            this.spinner.hide(); // ✅ Hide Spinner after timeout
          }, 500); // Hide after 1.5s
          this.notifications = response.notifications;
        } else {
          this.notifications = [];
          console.warn("⚠ No notifications found.");
        }
      }, error => {
        console.error("❌ Error fetching notifications:", error);
      });
    }
  
    // ✅ Fetch Notification by ID (View Notification)
    viewNotification(notificationId: number): void {
      this.apiSer.getNotificationById(notificationId).subscribe(response => {
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
}
