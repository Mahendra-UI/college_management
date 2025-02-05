import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-allstudents',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './allstudents.component.html',
  styleUrl: './allstudents.component.scss'
})
export class AllstudentsComponent implements OnInit {
  searchText : any = '';
  constructor() {

  }
  ngOnInit(): void {
    
  }
}
