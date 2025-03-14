import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParentComponent } from '../parent/parent.component';
import { ChildComponent } from '../child/child.component';
import { Sibiling1Component } from '../sibiling1/sibiling1.component';
import { Sibiling2Component } from '../sibiling2/sibiling2.component';

@Component({
  selector: 'app-common-comp',
  standalone: true,
  imports: [CommonModule, RouterModule, ParentComponent, ChildComponent, Sibiling1Component, Sibiling2Component],
  templateUrl: './common-comp.component.html',
  styleUrl: './common-comp.component.scss'
})
export class CommonCompComponent {

}
