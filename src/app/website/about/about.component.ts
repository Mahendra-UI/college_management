import { Component } from '@angular/core';
import { CommonFormComponent } from '../common-form/common-form.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonFormComponent, RouterModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  aboutFormFields : string[] = ['firstName', 'emailId']
  aboutFormSubmitText: string = 'About Form Submit';
  aboutFormSubmit(formData : any) {
    console.log('About Form Submission:', formData);
  }

}
