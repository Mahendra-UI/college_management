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
  constructor(private route:ActivatedRoute,
    private router:Router) {
   }
  encrypted:any;
  ngOnInit(): void {
    }
  signOut(){
    this.router.navigate(['/login']);
  }
  menuToggle(){
    this.toggle.emit();
  }
}
