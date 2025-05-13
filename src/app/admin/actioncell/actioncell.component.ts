import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Modal } from 'bootstrap'; // ✅ Bootstrap 5 native import
@Component({
  selector: 'app-actioncell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actioncell.component.html',
  styleUrl: './actioncell.component.scss'
})
export class ActioncellComponent implements ICellRendererAngularComp {
  params: any;

  constructor() {

  }
  agInit(params : any): void {
    this.params = params;
    // Initialization logic if needed
  }
  refresh(): boolean {
    return false;
  }


  onView() {
    this.params.context.componentParent.viewNotification(this.params.data.notification_id);
  
    // const modalEl = document.getElementById('viewNotificationModal');
    // if (modalEl) {
    //   const modal = Modal.getOrCreateInstance(modalEl);
    //   modal.show();
    // }
  }
  
  onEdit() {
    this.params.context.componentParent.editNotification(this.params.data.notification_id);
  
    // const modalEl = document.getElementById('addNotificationModal');
    // if (modalEl) {
    //   const modal = Modal.getOrCreateInstance(modalEl);
    //   modal.show();
    // }
  }
  

  // onView() {
  //   this.params.context.componentParent.viewNotification(this.params.data.notification_id);
  //   document.getElementById('viewNotificationModal')?.click();
  // }
  // onEdit() {
  //   this.params.context.componentParent.editNotification(this.params.data.notification_id);
  //   document.getElementById('addNotificationModal')?.click();
  // }
  onDelete() {
    this.params.context.componentParent.deleteNotification(this.params.data.notification_id);
  }

}
