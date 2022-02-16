import { Component, OnInit, EventEmitter, Output} from '@angular/core';

// in order to clear up the memory about the auth Status, we need to import Subscription
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$ : Observable<boolean>;

  username : string;

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) { }

  ngOnInit(): void {
    // remember this happen when the component is created!
    // we are subscribing to an observable (authChange)
    // we will get true if we are login and false if we are not.
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit()
  }

  onLogout() {
    this.authService.logout();
  }


  getUserName() {
      this.username = this.authService.getCurrentlyLoggedUserName(); 
    }

    goToLink(url: string){
      window.open(url, "_blank");
  }
  

}
