import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hostelstudentsmanage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hostelstudentsmanage.component.html',
  styleUrl: './hostelstudentsmanage.component.scss'
})
export class HostelstudentsmanageComponent implements OnInit {
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
