import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

export class Users {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string,
  ) {}

  get imgUrl() {
    if(this.img) {
      if(this.img.includes('https')) {
        return this.img;
      }
      return `${baseUrl}/uploads/users/${this.img}`
    } else {
      return `${baseUrl}/uploads/users/no-img`
    }
  }
} 