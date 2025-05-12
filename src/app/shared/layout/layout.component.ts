import {Component, HostListener, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {NgClass, NgIf} from '@angular/common';

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


  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
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
