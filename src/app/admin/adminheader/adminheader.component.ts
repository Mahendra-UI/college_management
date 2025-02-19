import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminheader',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './adminheader.component.html',
  styleUrl: './adminheader.component.scss'
})
export class AdminheaderComponent implements OnInit {
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  //@Input() headerLogin!:boolean;
  profilePic: any;
  subscription!: Subscription;
  registerInfo!: boolean;
  innerWidth: any;
  emploginData: any;


  fullName: string | null = null;
  course_name: string | null = null;
  username: string | null = null;
  constructor(private route:ActivatedRoute,
    private router:Router) {
   }
  encrypted:any;
  ngOnInit(): void {
    this.fullName = sessionStorage.getItem('fullName');
    this.username = sessionStorage.getItem('username');
    this.course_name = sessionStorage.getItem('course_name');

    if (!this.course_name) {
        console.warn("🚨 Warning: course_name is missing in sessionStorage!");
    } else {
        console.log("✅ Course Name Loaded:", this.course_name);
    }
    }
  signOut(){
    this.router.navigate(['/login']);
  }
  menuToggle(){
    this.toggle.emit();
  }
}
