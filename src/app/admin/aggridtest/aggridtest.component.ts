import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'app-aggridtest',
  standalone: true,
  imports: [CommonModule, RouterModule, AgGridAngular],
  templateUrl: './aggridtest.component.html',
  styleUrl: './aggridtest.component.scss'
})
export class AggridtestComponent implements OnInit {
  rowData: any[] = []
  constructor() {

  }

  ngOnInit(): void {
    this.rowData = [
      {rowId: 1, firstName: 'Mahendra', lastName: 'Babu', address: 'Hyderabad'},
      {rowId: 2, firstName: 'ravi', lastName: 'kumar', address: 'ongole'},
      {rowId: 3, firstName: 'siva', lastName: 'ravula', address: 'bengalore'},
      {rowId: 4, firstName: 'harish', lastName: 'kumar', address: 'guntur'},
      {rowId: 5, firstName: 'mahesh', lastName: 'reddy', address: 'vijayawada'},
    ]
    console.log(this.rowData);
    
  }



  // columnDefs : ColDef[] = [

  //   {field: 'rowId', headerName: 'ID', filter: 'agTextColumnFilter', headerCheckboxSelection: true, checkboxSelection: true},
  //   {field: 'fullName', flex: 1, valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`, headerName: 'Full Name', filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor'},
  //   // {field: 'firstName', flex: 1, headerName: 'First Name', filter: 'agTextColumnFilter'},
  //   // {field: 'lastName', flex: 1, headerName: 'Last Name', filter: 'agTextColumnFilter'},
  //   {field: 'address', flex: 2, headerName: 'Address', filter: 'agTextColumnFilter'}
  // ]

  columnDefs: ColDef[] = [
    {
      field: 'rowId',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50
    },
    {
      field: 'fullName',
      headerName: 'Full Name', valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      flex: 1,
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
          <button class="btn btn-sm btn-info view-btn">View</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        `;
      },
      onCellClicked: (params: any) => {
        const fullName = `${params.data.firstName} ${params.data.lastName}`;

        if (params.event.target.classList.contains('view-btn')) {
          alert(`Viewing: ${fullName}`);
          // Replace alert with your logic
        }
        if (params.event.target.classList.contains('delete-btn')) {
          alert(`Deleting: ${fullName}`);
          // Replace alert with your logic
        }
      },
      width: 150
    }
  ];
  


defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

gridAPi ! : GridApi
paginationPageSize: number = 2;
onGridReady(params: GridReadyEvent) {
  this.gridAPi = params.api
  this.gridAPi.setGridOption?.('pagination', true);
  this.gridAPi.setGridOption?.('paginationPageSize', this.paginationPageSize);
  this.gridAPi.sizeColumnsToFit();
  
}

}
