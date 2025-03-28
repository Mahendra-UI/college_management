import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentprofileComponent } from '../studentprofile/studentprofile.component';

@Component({
  selector: 'app-studentheader',
  standalone: true,
  imports: [RouterModule, CommonModule, StudentprofileComponent],
  templateUrl: './studentheader.component.html',
  styleUrl: './studentheader.component.scss'
})
export class StudentheaderComponent implements OnInit {
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

  fullName: string | null = null;
  course_name: string | null = null;
  username: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log("🔄 Fetching stored values from sessionStorage...");
    
    console.log("sessionStorage fullName:", sessionStorage.getItem('fullName'));
    console.log("sessionStorage username:", sessionStorage.getItem('username'));
    console.log("sessionStorage course_name:", sessionStorage.getItem('course_name'));

    this.fullName = sessionStorage.getItem('fullName');
    this.username = sessionStorage.getItem('username');
    this.course_name = sessionStorage.getItem('course_name');

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