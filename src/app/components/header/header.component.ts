import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  name!: string;
  country! : string;
  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}

  ngOnInit() {

    // get current user Name
    this.userStore.getNameFromToken().subscribe((val) => {
      let userNameFromToken = this.auth.getNameFromToken();
      this.name = val || userNameFromToken;
    });
    this.userStore.getOffset().subscribe(val => {
      this.country = val.name;
    })
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
