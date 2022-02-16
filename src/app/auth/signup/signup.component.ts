import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared/ui.service';
import { AuthService} from '../auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  maxDate: Date;
  hide: boolean = true;
  isLoading$ : Observable<boolean>;
 

  constructor(private authService: AuthService, private uiService: UIService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.maxDate = new Date();
    //en aquest cas, getFullYear() calcula l'any en que van neixer la gent que compleix 18 aquest any. 
    // setFullYear() dona un numero que representa el numero de milisegons entre la data actual i la que li hem posat com a parametre. 
    // tots dos metodes son de vanilla js, mes info a w3schools
    const getFullYear = this.maxDate.getFullYear() - 18
    this.maxDate.setFullYear(getFullYear);

  }

  onSubmit(form: NgForm){
 
    this.authService.registerUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
  }

  getEmailVerification(emailInput: NgForm) {

    if (emailInput.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Email is invalid';
  }



}

