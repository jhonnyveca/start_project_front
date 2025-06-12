import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

import {Router, RouterLink} from '@angular/router';

import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {AuthService} from '../service/auth.service';
import {environment} from '../../../../environments/environment';

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
export default class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: string = '';
  idProjectParam: number[] = environment.idProject
  idChannelParam: number[] = environment.idChannel




  private readonly allowedUsers = {
    'adminfinsight@alicorp.com': { project: this.idProjectParam[1], idChannel:this.idChannelParam[0] },
    'consultorfinsight@alicorp.com': {  project: this.idProjectParam[1] , idChannel:this.idChannelParam[0]  },
    'adminalivoice@alicorp.com': { project: this.idProjectParam[0] , idChannel:this.idChannelParam[0]  }
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

  ngOnInit(): void {
    console.log(this.idProjectParam[0])
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const projectManager = this.allowedUsers[email as keyof typeof this.allowedUsers];



      this.authService.login(projectManager.project, {
        idSession: 0,
        idProject: projectManager.project,
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
