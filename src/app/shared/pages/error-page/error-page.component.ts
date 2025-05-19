import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-error-page',
  imports: [
    ButtonDirective
  ],
  templateUrl: './error-page.component.html',
  standalone: true,
  styleUrl: './error-page.component.scss'
})
export default class ErrorPageComponent {
  constructor(private router: Router) {}

  redirectToLogin() {
    // Limpiar datos de sesión si es necesario
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir al login
    this.router.navigate(['/chat-box']).then(r => false);
  }

  reloadPage() {
    location.reload();
  }
}
