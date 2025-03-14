import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  constructor() { }

  messageSource = new BehaviorSubject<any>('initial message');

  currentMessage = this.messageSource.asObservable();

  changeMessage(data: any) {
    this.messageSource.next(data);
  }

}

