import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

import {Router, RouterLink} from '@angular/router';

import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {AuthService} from '../service/auth.service';

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
  loginError: string = '';
  idProject: string = '2'

  private readonly allowedUsers = {
    'adminfinsight@alicorp.com': { role: 1 },
    'consultorfinsight@alicorp.com': {  role: 2 },
    'adminalivoice@alicorp.com': { role: 3 }
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
  )
  {
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

  
      this.authService.login(this.idProject, {
        idSession: 0,
        idProject: 2,
        codSession: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
        idUser: 0,
        userLogin: email,
        beginDate: "2025-06-10T18:12:31.057Z",
        endDate: null,
        idChannel: 1
      }).subscribe({
        next: result => {
          console.log("Response : "+result);
          localStorage.setItem('idSession', result.idSession.toString());
          localStorage.setItem('idUser', result.idUser.toString());
          localStorage.setItem('idProject', result.idProject.toString());
          if (result.idProject > 0 && result.idProject !=1) {
            this.router.navigate(['/main/chat-box']);
          }else {
            this.router.navigate(['/main/indicators']);
          }
        },
        error: err => {
          console.log(err);
        }
        }
      )

    /**  localStorage.setItem('userRole', user.role.toString());
      localStorage.setItem('userEmail', email);
      if(user.role > 0 && user.role != 3) {
        this.router.navigate(['/main/chat-box']);
      }else{
        this.router.navigate(['/main/indicators']);
      }*/


     // this.loginError = 'Credenciales incorrectas o usuario no autorizado';

  }
}
