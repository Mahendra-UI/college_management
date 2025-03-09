import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Tooltip } from 'bootstrap';
import { Dropdown } from 'bootstrap';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {


  ngAfterViewInit() {
    this.initTooltips();
    this.initDropdowns();
  }

  title = 'college-management';
  isLoading = false;
  isBrowser: boolean;
  constructor(private spinner: NgxSpinnerService, private router:Router,public elementRef: ElementRef, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    // this.router.events.subscribe((val:any)=>{
    //   if (val instanceof NavigationEnd) {
    //     let ele: any = document.querySelector('#navbarNavDropdown');
    //     this.renderer.removeClass(ele,'show')
    //   }
    // })

    if (this.isBrowser) {
      this.router.events.subscribe((val: any) => {
        if (val instanceof NavigationEnd) {
          let ele: any = document.querySelector('#navbarNavDropdown');
          if (ele) {
            this.renderer.removeClass(ele, 'show');
          }
        }
      });
    }
    
   }

   private initTooltips() {
    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        const customClass = tooltipTriggerEl.getAttribute('data-tooltip-class');
        new Tooltip(tooltipTriggerEl, {
          trigger: 'hover',
          customClass: customClass || ''
        });
      });
    }, 500);
  }

  private initDropdowns() {
    setTimeout(() => {
      const dropdownElements = document.querySelectorAll('.dropdown-toggle');
  
      dropdownElements.forEach(dropdownElement => {
        const dropdownInstance = Dropdown.getInstance(dropdownElement);
        if (!dropdownInstance) {
          new Dropdown(dropdownElement);
        }
      });
    }, 1000);
  }
  

   ngOnInit(): void {
     // Show spinner globally on app initialization
      // Reinitialize tooltips when navigation changes
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.initTooltips();
        }
      });
    this.isLoading = true; // Set true to demonstrate spinner, set to false after data fetch

    if (this.isBrowser) {
      // Safe to interact with document or window here
      // Example: Scroll to top on component initialization
      window.scrollTo(0, 0);

      // Example: Add an event listener to the window object
      window.addEventListener('scroll', this.onWindowScroll);
    }
  }
  onActivate(event: any) {
    if (this.isBrowser) {
      window.scroll(0, 0);
      // or document.body.scrollTop = 0;
      // or document.querySelector('body')?.scrollTo(0, 0);
    }
  }
  onWindowScroll = (): void => {
    // Your scroll handling logic
    // console.log('Window is scrolling');
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      // Clean up the event listener to avoid memory leaks
      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }
}
