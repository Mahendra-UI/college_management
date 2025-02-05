import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-managestudents',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './managestudents.component.html',
  styleUrl: './managestudents.component.scss'
})
export class ManagestudentsComponent implements OnInit {
  studentForm! : FormGroup
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    
  }
  onSubmit() {
    if(this.studentForm.valid) {
      console.log(this.studentForm.value);      
    }
  }
}
