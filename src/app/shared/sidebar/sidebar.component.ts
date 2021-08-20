import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  public user: Users;
  menuItems: any[];
  constructor(
    private userService: UsersService,
    public sidebarService: SidebarService
  ) {
    // this.menuItems = sidebarService.menu;
    this.user = userService.user;
  }

  ngOnInit() {
  }

}
