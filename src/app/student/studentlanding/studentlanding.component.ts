import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { StudentheaderComponent } from '../studentheader/studentheader.component';
import { StudentfooterComponent } from '../studentfooter/studentfooter.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { StudentsidebarComponent } from '../studentsidebar/studentsidebar.component';

@Component({
  selector: 'app-studentlanding',
  standalone: true,
  imports: [StudentheaderComponent, StudentfooterComponent, RouterModule, CommonModule, StudentsidebarComponent],
  templateUrl: './studentlanding.component.html',
  styleUrl: './studentlanding.component.scss'
})
export class StudentlandingComponent implements OnInit {
  header!:boolean
  screenWidth:any;
  subscription!: Subscription;
  constructor(public router:Router,private renderer:Renderer2,private ele:ElementRef){
      
    //   this._document.location.reload();
   
        
       this.router.events.pipe(filter(event => event instanceof NavigationEnd))
       .subscribe((eve:any) => {
 
        if(this.screenWidth < 992.98){
         document.querySelector('.modal-layer')?.remove();
         document.querySelector('.left-panel')?.classList.add('active')
        }
         
   
       });
     }
   
     show: boolean = true;
   
   menuVisible: boolean = false;

 
   // toggleMenu(){
   //   this.menuVisible = !this.menuVisible
   // }
     ngOnInit() {
       this.getScreenSize()
       //sessionStorage.setItem("UserDetails",'false')
       // window.location.reload();
      // console.log(this.name,this.userExists)
      //  this.userExistsLogin = false;
       //localStorage.setItem("loggedIn",'false');
      // sessionStorage.setItem('loggedIn','false');
     //  let result = localStorage.getItem("loggedIn");
     //  if(result!='false'){
     //   this.getProfileData()
     //  }
   
       // let promise  = new Promise((resolve,reject)=>{
       //   resolve(this.getScreenSize)
       // })
   
       // promise.then(()=>{
       //     let ele:any = document.querySelector('.left-panel'); 
       //     this.renderer.removeClass(ele,'active');
       //   }
       // )
     //  setTimeout(()=>{
     //   this.getScreenSize()
     //  })
    
   // let promise = new Promise((resolve,reject)=>{
   //    resolve(result)
   // })
   
   // promise.then(()=>{
   //   console.log(result)
   //   if(result=='true'){
   //     setTimeout(()=>{
         
   //     },100)
       
   //   }
   // }
     
   // );
   
     }

  onActivate(event:any) {
    window.scroll(0,0);
  }
  toggleMenu(){
    this.menuVisible = !this.menuVisible;
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 993){
     const div = this.renderer.createElement('div');
    // this.renderer.setAttribute(div,'#dynamicModal');
     //div.classList.add('modal-backdrop')
     div.classList = 'modal-backdrop fade show modal-layer'
     const body:any = document.querySelector('body');
     body.appendChild(div);
     let ele = document.querySelector('.left-panel');
       if(ele?.classList.contains('active')){
        setTimeout(()=>{
          ele?.classList.remove('active');
        },100)
       }
       else{
        ele?.classList.add('active');
       }

     document.querySelector('.modal-layer')?.addEventListener('click',(eve:any)=>{
       ele?.classList.add('active');
       let rootEle = this.renderer.selectRootElement('.modal-layer');
       rootEle.remove();
     })

    }
  }
  getScreenSize(){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 767){
      document.querySelector('.sidebar')?.classList.add('mobile-active')
    }
  }
  ngOnDestroy(): void{
    //sessionStorage.clear()
  }
}