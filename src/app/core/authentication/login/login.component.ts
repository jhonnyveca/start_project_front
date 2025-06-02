import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

import {Router, RouterLink} from '@angular/router';

import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputText,
    RouterLink,
    FloatLabel,
    FormsModule,
    IconField,
    InputIcon
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  loginForm: FormGroup;
  value2: string | undefined;
  loginError: string = '';

  private readonly allowedUsers = {
    'adminfinsight@alicorp.com': { role: 1 },
    'consultorfinsight@alicorp.com': {  role: 2 },
    'adminalivoice@alicorp.com': { role: 3 }
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const user = this.allowedUsers[email as keyof typeof this.allowedUsers];

    if (user) {

      localStorage.setItem('userRole', user.role.toString());
      localStorage.setItem('userEmail', email);
      if(user.role > 0 && user.role != 3) {
        this.router.navigate(['/main/chat-box']);
      }else{
        this.router.navigate(['/main/indicators']);
      }

    } else {
      this.loginError = 'Credenciales incorrectas o usuario no autorizado';
    }
  }
}
