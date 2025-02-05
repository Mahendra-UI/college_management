import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentheaderComponent } from '../studentheader/studentheader.component';
import { StudentfooterComponent } from '../studentfooter/studentfooter.component';

@Component({
  selector: 'app-studentsidebar',
  standalone: true,
  imports: [CommonModule, StudentheaderComponent, StudentfooterComponent, RouterModule],
  templateUrl: './studentsidebar.component.html',
  styleUrl: './studentsidebar.component.scss'
})
export class StudentsidebarComponent implements OnInit {
  menuList:any = [];


  menuItems: any;
  showDropDown: boolean = false;
  subscription!:Subscription;
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
}
