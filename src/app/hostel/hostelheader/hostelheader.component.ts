import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hostelheader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostelheader.component.html',
  styleUrl: './hostelheader.component.scss'
})
export class HostelheaderComponent implements OnInit {
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

  full_name: string | null = null;
  course_name: string | null = null;
  username: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log("🔄 Fetching stored values from sessionStorage...");
  
    // ✅ Fetch correct sessionStorage keys
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
    console.log('🔄 Logging out...');

    sessionStorage.clear(); // ✅ Clear stored session values
  
    this.router.navigate(['/login'], { replaceUrl: true }); // ✅ Redirect to login
    // sessionStorage.clear();
    // this.router.navigate(['/login']);
  }
    

  menuToggle() {
    this.toggle.emit();
  }
}
