import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminheaderComponent } from '../adminheader/adminheader.component';
import { AdminfooterComponent } from '../adminfooter/adminfooter.component';
import { Subscription } from 'rxjs';
import AOS from 'aos';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminheaderComponent, AdminfooterComponent],
  templateUrl: './adminsidebar.component.html',
  styleUrl: './adminsidebar.component.scss'
})
export class AdminsidebarComponent implements OnInit, AfterViewInit {
  menuList:any = [];


  menuItems: any;
  showDropDown: boolean = false;
  subscription!: Subscription;
  profilePic:any;
  innerWidth:any;
  emploginData:any;
  constructor(private router: Router) { }


  ngOnInit(): void {
    
    this.getPredMenu();

    console.log('side menu', this.emploginData)
    this.getDevice();
  }
  dropdownOpen: boolean = false;
  @HostListener('window:resize',['$event'])
  onResize(){
    this.getDevice()
  }
  ngAfterViewInIt(){
  
  }
  
  getDevice(){
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 992){
     document.querySelector('.header')?.classList.add('mobileHeader');
     document.querySelector('.navbar-light')?.classList.add('fixed-top');
    }else{
      document.querySelector('.header')?.classList.remove('mobileHeader');
     document.querySelector('.navbar-light')?.classList.remove('fixed-top');
    }
  }
  

  getPredMenu(){
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  showData () {
     if (this.showDropDown) {
       this.showDropDown = false
     } else {
       this.showDropDown = true
     }
  }

  changeRoute(event:any) {
    if (event.value === "1") {
      this.router.navigate(['/fourgl']);
    } else {
      this.router.navigate(['fiveg']);
    }
  }
    /** ✅ Initialize Animations */
    ngAfterViewInit(): void {
      console.log("Initializing AOS...");
      AOS.init({
        duration: 1000,
        once: true,
      });
  
      setTimeout(() => {
        console.log("Refreshing AOS...");
        AOS.refresh();
      }, 500);
    }
}
