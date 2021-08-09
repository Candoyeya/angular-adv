import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private userService: UsersService
  ) { }

  logout() {
    this.userService.logout();
  }
}
