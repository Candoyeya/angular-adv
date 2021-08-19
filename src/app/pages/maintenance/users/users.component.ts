import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Users } from 'src/app/models/users.model';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchingService } from 'src/app/services/searching.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit, OnDestroy {
  public totalUsers: number = 0;
  public users: Users[] = [];
  public from: number = 0;
  public loading: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private usersService: UsersService,
    private searchingService: SearchingService,
    private modalImageService: ModalImageService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit() {
    this.loadUsers();

    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100)).subscribe(img => this.loadUsers());
  }

  loadUsers() {
    this.loading = true;
    this.usersService.loadUsers(this.from)
      .subscribe((resp:any) => {
        if(resp.ok) {
          const { users, total } = resp;
          this.totalUsers = total;
          this.users = users;
        }

        this.loading = false;
      })
  }

  changePage(value: number) {
    this.from += value;

    if( this.from < 0 ) {
      this.from = 0
    } else if( this.from > this.totalUsers ) {
      this.from -= value;
    }

    this.loadUsers();
  }

  onChangeSearch(value:string) {
    this.loading = true;
    if(value.length) {
      this.searchingService.search('users', value)
      .subscribe((resp:any) => {
        if(resp.ok) {
          const { results } = resp;
          this.totalUsers = results.length;
          this.users = results;
        }

        this.loading = false;
      });
    } else {
      this.loadUsers();
    }
  }

  deleteUser(user:Users) {
    if(user.uid === this.usersService.user.uid) {
      return Swal.fire('Error', 'You cannot erase yourself', 'error');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(user.uid)
          .subscribe((resp:any) => {
            if(resp.ok) {
              Swal.fire(
                'Deleted!',
                `User ${user.name} deleted`,
                'success'
              );
              this.loadUsers();
            } else {
              // if error exist
              Swal.fire('Error', 'Error deleting user', 'error');
            }
          }, (e) => {
            // if error exist
            Swal.fire('Error', e.error.msg, 'error');
          });
      }
    })
  }

  changeRole(user: Users) {
    console.log('changeRole===>');
    this.usersService.changeRole(user)
      .subscribe((resp:any) => {
        console.log('userUpdate==>',resp);
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      })
  }

  openModal(user: Users) {
    this.modalImageService.openModal('users', user.uid, user.img);
  }
}
