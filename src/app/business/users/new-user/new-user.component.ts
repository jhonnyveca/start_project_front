import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputText} from 'primeng/inputtext';
import {User} from '../../../../domain/user';
import {MultiSelect} from 'primeng/multiselect';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-new-user',
  imports: [
    FormsModule,
    ButtonDirective,
    DropdownModule,
    InputText,
    MultiSelect,
    RouterLink
  ],
  templateUrl: './new-user.component.html',
  standalone: true,
  styleUrl: './new-user.component.scss'
})
export default class NewUserComponent {
  user: User = {
    name: '',
    email: '',
    role: '',
    appUser: ''
  };

  roles = [
    { name: 'Administrador', code: 'admin' },
    { name: 'Consultor', code: 'editor' }
  ];

  apps = [
    { name: 'CMP', code: '1' },
    { name: 'CMP Foods', code: '2' },
    { name: 'Full Negocio', code: '3' },
    { name: 'B2B Gastronomía', code: '4' },
    { name: 'CMI Bolivia', code: '4' },
    { name: 'CMP Lima', code: '4' },
  ];

  createUser() {
    console.log('Usuario creado:', this.user);
    // lógica para enviar al backend
  }

  cancel() {
    this.user = {
      name: '',
      email: '',
      role: '',
      appUser: ''
    };
  }
}
