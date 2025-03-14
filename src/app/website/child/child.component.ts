import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParentComponent } from '../parent/parent.component';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {
  @Input() childMessage!: string; // Receives data from Parent

  @Output() childMessageEvent = new EventEmitter<any>();


  sendData() {
    this.childMessageEvent.emit('Hi, This is from Child component');    
  }

}
