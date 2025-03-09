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

  full_name: string | null = null;
  course_name: string | null = null;
  username: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log("🔄 Fetching stored values from sessionStorage...");
  
    // ✅ Fetch correct sessionStorage keys
    // this.full_name = sessionStorage.getItem('full_name') || sessionStorage.getItem('fullName'); // Handles both variations
    this.full_name = sessionStorage.getItem('full_name') || sessionStorage.getItem('fullName'); // Handles both variations
    this.username = sessionStorage.getItem('username');
    this.course_name = sessionStorage.getItem('course_name');
  
    console.log("sessionStorage full_name:", this.full_name);
    console.log("sessionStorage username:", this.username);
    console.log("sessionStorage course_name:", this.course_name);
  
    if (!this.full_name) {
      console.warn("🚨 Warning: full_name is missing in sessionStorage!");
      this.full_name = "User"; // Default value
    }
  
    if (!this.course_name) {
      console.warn("🚨 Warning: course_name is missing in sessionStorage!");
    } else {
      console.log("✅ Course Name Loaded:", this.course_name);
    }
  }
  

  signOut() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
    

  menuToggle() {
    this.toggle.emit();
  }
}
