import {Component, HostListener, Inject, OnInit, Renderer2} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {DOCUMENT, NgClass, NgIf} from '@angular/common';

import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    ButtonDirective,
    Menu,
    NgClass,
    NgIf,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss'
})
export default class LayoutComponent implements OnInit {

  sidebarCollapsed = false;
  sidebarVisible = true;
  isMobile = false;

  isDarkTheme = true;


  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.checkSavedTheme();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.applyDarkTheme();
    }
  }
  applyDarkTheme() {
    this.renderer.addClass(this.document.body, 'dark-theme');
    // Añade aquí cualquier otra lógica específica para el tema oscuro
  }

  applyLightTheme() {
    this.renderer.removeClass(this.document.body, 'dark-theme');
    // Añade aquí cualquier otra lógica específica para el tema claro
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.applyDarkTheme();
      localStorage.setItem('theme', 'dark');
    } else {
      this.applyLightTheme();
      localStorage.setItem('theme', 'light');
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
      this.sidebarVisible = true;
    } else {
      this.sidebarCollapsed = false;
      this.sidebarVisible = true;
    }
  }

  toggleCollapse() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onMenuOptionClick() {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  userItems = [
    { label: 'Perfil', icon: 'pi pi-user', command: () => this.viewProfile() },
    { label: 'Configuración', icon: 'pi pi-cog', command: () => this.openSettings() },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];

  viewProfile() {
    console.log('Ver perfil');
  }

  openSettings() {
    console.log('Abrir configuración');
  }

  logout() {
    console.log('Cerrar sesión');
  }

}
