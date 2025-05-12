import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent:()=> import('./shared/layout/layout.component'),
    children:[
      {
        path:'chat-box',
        loadComponent: () => import('./business/chat-box/chat-box.component'),
      },
      {
        path:'users',
        loadComponent:() => import('./business/users/users.component'),
      },
      {
        path:'users/register',
        loadComponent:()=> import('./business/users/new-user/new-user.component'),
      },
      {
        path:'documents',
        loadComponent:() => import('./business/documents/documents.component'),
      },
      {
        path:'indicators',
        loadComponent:()=> import('./business/indicators/indicators.component'),
      },
      {
        path:'dashboard',
        loadComponent:()=> import('./business/dashboard/dashboard.component'),
      },
      {
        path:'',
        redirectTo:'chat-box',
        pathMatch:'full'
      }
    ]
  },
  {
    path:'**',
    redirectTo:'chat-box',
  }
];
