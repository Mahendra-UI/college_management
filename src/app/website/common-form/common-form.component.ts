import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-common-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './common-form.component.html',
  styleUrl: './common-form.component.scss'
})
export class CommonFormComponent implements OnInit {

  @Input() formFields : string[] = [];

  // @Input() optionalFields : string[] = [];

  @Output() formSubmit = new EventEmitter<any>();

  @Input() formSubmitText : string = 'Submit';

  commonForm! : FormGroup;

constructor(private fb: FormBuilder) {

}

ngOnInit(): void {
  this.createForm();
}

commonFormValidators : { [key: string] : any[] } = {
  firstName : [Validators.required],
  lastName : [Validators.required],
  middleName : [],
  mobileNumber : [Validators.required, Validators.pattern('^[0-9]*$')],
  emailId : [Validators.required, Validators.pattern('^[a-zA-Z0-9+._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]
}
createForm() {
  const commonFormGroup : { [key: string] : FormControl } = {}
  this.formFields.forEach((field: any) => {
    if(this.commonFormValidators[field]) {
      commonFormGroup[field] = new FormControl('', this.commonFormValidators[field]);
    }
    else {
      commonFormGroup[field] = new FormControl('');
    }
  });
  this.commonForm = this.fb.group(commonFormGroup)
}

getFormCtrl(controlName: string) {
  return this.commonForm.get(controlName);
}

onSubmit() {
  if(this.commonForm.valid) {
    this.formSubmit.emit(this.commonForm.value);
    this.commonForm.reset();
  }
  else {
    console.log("Form is Invalid :", this.commonForm.errors);
  }
}

}
