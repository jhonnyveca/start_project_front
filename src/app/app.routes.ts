import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent:()=> import('./shared/layout/layout.component'),
    children:[
      {
        path:'chat-box',
        loadComponent: () => import('./modules/chat-box/chat-box.component'),
      },
      {
        path:'users',
        loadComponent:() => import('./modules/users/users.component'),
      },
      {
        path:'users/register',
        loadComponent:()=> import('./modules/users/new-user/new-user.component'),
      },
      {
        path:'repositories',
        loadComponent:() => import('./modules/documents/documents.component'),
      },
      {
        path:'repositories/register',
        loadComponent:()=> import('./modules/documents/new-document/new-document.component'),
      },
      {
        path:'indicators',
        loadComponent:()=> import('./modules/indicators/indicators.component'),
      },
      {
        path:'dashboard',
        loadComponent:()=> import('./modules/dashboard/dashboard.component'),
      },
      {
        path:'template',
        loadComponent:()=> import('./modules/template/template.component'),
      },
      {
        path:'',
        redirectTo:'chat-box',
        pathMatch:'full'
      }
    ]
  },
  {
    path:'error-page',
    loadComponent:()=> import('./core/authentication/error-page/error-page.component'),
  }
];
