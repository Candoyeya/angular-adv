import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {
  public user: Users;
  constructor(
    private router: Router,
    private userService: UsersService
  ) {
    this.user = userService.user;
  }

  logout() {
    this.userService.logout();
  }

  search(value: string) {
    if(value.length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/search/${value}`);
  }
}
