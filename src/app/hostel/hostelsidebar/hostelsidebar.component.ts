import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hostelsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostelsidebar.component.html',
  styleUrl: './hostelsidebar.component.scss'
})
export class HostelsidebarComponent {

}
