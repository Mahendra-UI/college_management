
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import AOS from 'aos';




@Component({
  selector: 'app-studenthome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './studenthome.component.html',
  styleUrl: './studenthome.component.scss',
})
export class StudenthomeComponent implements OnInit, AfterViewInit {
  constructor() {

  }
  ngOnInit(): void {
    // AOS.init();
  }
  ngAfterViewInit(): void {
    console.log("Initializing AOS..."); // Debugging
    AOS.init({
      duration: 1000, // Duration of animations in ms
      once: true, // Animation happens only once
    });

    setTimeout(() => {
      console.log("Refreshing AOS...");
      AOS.refresh();
    }, 500); // Ensure reinitialization after view rendering
  }
}
