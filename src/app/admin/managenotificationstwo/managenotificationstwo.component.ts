import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  DomLayoutType,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  TextFilterModule,
  NumberFilterModule,
  PinnedRowModule,
  ValidationModule,
  CsvExportModule,
  PaginationModule,
  RowSelectionModule,
  ColumnAutoSizeModule,
  AllCommunityModule
} from 'ag-grid-community';
import { ActioncellComponent } from '../actioncell/actioncell.component';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

// ModuleRegistry.registerModules([
//   TextFilterModule,
//   PinnedRowModule,
//   ClientSideRowModelModule,
//   NumberFilterModule,
//   ValidationModule,
//   CsvExportModule,
//   PaginationModule,
//   RowSelectionModule,
//   ColumnAutoSizeModule
// ]);

ModuleRegistry.registerModules([
  AllCommunityModule
]);

export const columnDefs: ColDef[] = [
  {
    field: 'notification_id',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    filter: 'agTextColumnFilter',
    cellEditor: 'agRichSelectCellEditor',
    editable: true
  },
  {
    field: 'title_description',
    headerName: 'Description',
    flex: 2,
    filter: 'agTextColumnFilter',
    cellEditor: 'agRichSelectCellEditor',
    editable: true
  },
  {
    headerName: 'Actions',
    cellRenderer: ActioncellComponent,
    cellEditor: 'agRichSelectCellEditor',
    sortable: false,
    filter: false,
    width: 120,
    colId: 'actions'
  }
];

export function exportToCSV(gridApi: GridApi, columns: ColDef[]): void {
  const exportColumns = columns
    .filter((col: ColDef) => col.colId !== 'actions' && col.field)
    .map((col: ColDef) => col.field!);

  gridApi.exportDataAsCsv({
    columnKeys: exportColumns
  });
}
@Component({
  selector: 'app-managenotificationstwo',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    ActioncellComponent, ReactiveFormsModule
  ],
  templateUrl: './managenotificationstwo.component.html',
  styleUrl: './managenotificationstwo.component.scss'
})
export class ManagenotificationstwoComponent implements OnInit {

  public columnDefs = columnDefs;
  public exportToCSV(): void {
    exportToCSV(this.gridApi, this.columnDefs);
  }
  

  notificationForm!: FormGroup;
  notifications: any[] = [];
  isEditing: boolean = false;
  editNotificationId: number | null = null;

  private gridApi!: GridApi;

  rowData: any[] = [];
  // columnDefs: ColDef[] = [
  //   { field: 'title', headerName: 'Title', flex: 1, filter: 'agTextColumnFilter', editable: true },
  //   { field: 'title_description', headerName: 'Description', flex: 2, filter: 'agTextColumnFilter', editable: true },
  //   {
  //     headerName: 'Actions',
  //     cellRenderer: ActioncellComponent,
  //     sortable: false,
  //     filter: false,
  //     width: 120,
  //     colId: 'actions'
  //   }
  // ];




  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  };

  modules = [
    ClientSideRowModelModule,
    PaginationModule,
    RowSelectionModule,
    ColumnAutoSizeModule,
    CsvExportModule
  ];
  domLayout: DomLayoutType = 'normal';
  popupParent: HTMLElement | null = document.body;
  selectedNotification: any = null;
  currentEditId: number | null = null;
  paginationPageSize: number = 10;
// In inlineEditNotification
inlineEditNotification(row: any): void {
  this.currentEditId = row.notification_id;
  this.notificationForm.patchValue({
    title: row.title,
    title_description: row.title_description
  });
}
onCellValueChanged(event: any) {
  const { data } = event;
  this.apiService.updateNotification(data.notification_id, {
    title: data.title,
    title_description: data.title_description
  }).subscribe(() => {
    this.toastr.success('Updated successfully');
  }, () => {
    this.toastr.error('Update failed');
  });
}

saveInlineEdit(rowId: number): void {
  if (this.notificationForm.valid) {
    this.apiService.updateNotification(rowId, this.notificationForm.value).subscribe(response => {
      this.loadNotifications();
      this.currentEditId = null;
      this.notificationForm.reset();
      Swal.fire('✅ Success', 'Notification Updated!', 'success');
    });
  }
}

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
      private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      title_description: ['', Validators.required]
    });

    this.loadNotifications();
  }

  onRowValueChanged(event: any): void {
    const updatedData = event.data;
    this.apiService.updateNotification(updatedData.notification_id, updatedData).subscribe({
      next: () => {
        this.toastr.success("Notification updated successfully!");
      },
      error: () => {
        this.toastr.error("Failed to update notification.");
      }
    });
  }
  

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.setGridOption?.('pagination', true);
    this.gridApi.setGridOption?.('paginationPageSize', this.paginationPageSize);
    this.gridApi.sizeColumnsToFit();
  }
  

  // exportToCSV(): void {
  //   const exportColumns = this.columnDefs
  //     .filter(col => col.colId !== 'actions' && col.field)
  //     .map(col => col.field!);

  //   this.gridApi.exportDataAsCsv({
  //     columnKeys: exportColumns
  //   });
  // }

  loadNotifications(): void {
    this.apiService.getNotifications().subscribe(response => {
      if (response.success) {
        this.rowData = response.notifications;
      } else {
        this.rowData = [];
        console.warn("⚠ No notifications found.");
      }
    }, error => {
      console.error("❌ Error fetching notifications:", error);
    });
  }

  resetForm() {
    this.notificationForm.reset();
    this.isEditing = false;
    this.editNotificationId = null;
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      const notificationData = this.notificationForm.value;

      if (this.isEditing && this.editNotificationId) {
        this.apiService.updateNotification(this.editNotificationId, notificationData).subscribe(response => {
          this.isEditing = false;
          this.editNotificationId = null;
          this.loadNotifications();
          this.notificationForm.reset();
          Swal.fire("✅ Success", "Notification Updated Successfully!", "success");
        }, error => {
          alert("❌ Error updating notification.");
        });
      } else {
        this.apiService.addNotification(notificationData).subscribe(response => {
          if (response.success) {
          this.loadNotifications();
          this.notificationForm.reset();
          Swal.fire("✅ Success", "Notification Submitted Successfully!", "success");
          } else {
            Swal.fire("❌ Error", response.message, "error");
          }
        }, 
        error => {
          console.error("❌ API Error:", error);
          Swal.fire("❌ API Error", error.message, "error");
        });
      }
    }
  }

  viewNotification(id: number): void {
    this.apiService.getNotificationById(id).subscribe(response => {
      if (response.success) {
        this.selectedNotification = response.notification;
        console.log("✅ Notification Details Loaded:", this.selectedNotification);
      } else {
        console.warn("⚠ Notification not found.");
        this.selectedNotification = null;
      }
    }, error => {
      console.error("❌ Error fetching notification:", error);
    });
  }

  editNotification(notificationId: number): void {
    this.isEditing = true;
    this.editNotificationId = notificationId;
  
    this.apiService.getNotificationById(notificationId).subscribe(
      (response) => {
        if (response.success) {
          const notification = response.notification;
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

  deleteNotification(id: number): void {
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
        this.apiService.deleteNotification(id).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire('Deleted!', 'Notification has been deleted.', 'success');
              this.rowData = this.rowData.filter((n) => n.notification_id !== id);
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