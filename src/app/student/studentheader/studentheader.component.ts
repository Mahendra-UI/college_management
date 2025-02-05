import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-studentheader',
  standalone: true,
  imports: [],
  templateUrl: './studentheader.component.html',
  styleUrl: './studentheader.component.scss'
})
export class StudentheaderComponent implements OnInit {
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