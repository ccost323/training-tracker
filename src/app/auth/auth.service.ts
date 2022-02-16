// Subject is an object that allows yo to event emit and subscribe to it and othher parts of the map.
// whenever we register a user, we want to emit an event. This is used for making the header dinamically deppending if we are or not login, we will show the login button or not
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { LoginData, SigninData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';


// service for show/hide logout/login depending if the user is or not logged. 

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();

  private isAuthenticated = false;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private trainingService: TrainingService, private uiService: UIService, private store: Store<{ui: fromRoot.State}>) {}

  private authSucessfully() {
    this.store.dispatch(new Auth.SetAuthenticated());
    this.router.navigate(['/training'])
  }

  private authUnsucessfully() {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
  }

  initAuthListener() {
    // it emits an event everytime the authentification method changes.
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.authSucessfully()
      } else {
        this.authUnsucessfully()
      }
    });
  }


  // store a new user when we register a user
  registerUser(signinData: SigninData) {

    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    
    this.angularFireAuth.createUserWithEmailAndPassword(
      signinData.email,
      signinData.password)
      .then(result => {
        localStorage.setItem('currentUserName', JSON.stringify(signinData.name));
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });

  }

  //
  login(loginData: LoginData, username: string) {

    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    this.angularFireAuth.signInWithEmailAndPassword(
      loginData.email, 
      loginData.password)
      .then(result => {
        localStorage.setItem('currentUserName', JSON.stringify(username));
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading())
      })
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading())
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

getCurrentlyLoggedUserName() {

  return JSON.parse(localStorage.getItem('currentUserName'))
}

  // to make this.user undefined, so it can logout

  logout() {
    localStorage.removeItem('currentUserName')
    this.angularFireAuth.signOut();
  }
  
}

