import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {
  public formSubmitted = false;
  public registerForm = this.fb.group({
    name: ['Alejandro Estrada adv1', [Validators.required, Validators.minLength(3)]],
    email: ['adv1@mailinator.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
    passwordConfirm: ['123456', [Validators.required]],
    terms: [true, [Validators.required]],
  }, {
    validators: this.passwordsMatch('password', 'passwordConfirm')
  });
  constructor(
    private router: Router,
    private fb:FormBuilder,
    private userService:UsersService
  ) { }

  createUser() {
    this.formSubmitted = true;
    console.log('createUser==>',this.registerForm.value);
    if(this.registerForm.invalid) {
      return;
    }

    // Do request
    this.userService.createUser(this.registerForm.value)
      .subscribe((resp:any) => {
        if(resp.ok)
        this.router.navigateByUrl('/');
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      });
  }

  fieldNotValid(field: string): boolean {
    if(this.registerForm.get(field).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordValidation() {
    const pass = this.registerForm.get('password').value;
    const passConfirm = this.registerForm.get('passwordConfirm').value;

    if((pass !== passConfirm) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  agreeTerms() {
    return !this.registerForm.get('terms').value && this.formSubmitted;
  }

  passwordsMatch(pass1: string, pass2: string) {
    return(formGroup: FormGroup) => {
      const passControl = formGroup.get(pass1);
      const passConfirmControl = formGroup.get(pass2);

      if(passControl.value === passConfirmControl.value) {
        passConfirmControl.setErrors(null);
      } else {
        passConfirmControl.setErrors({noMatch: true});
      }
    }
  }
}
