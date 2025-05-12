import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsersData(){
    return [
      {
        id:'1000',
        name:'Emiliano Rodriguez',
        email:'a.a@.a',
        role:'Consultant',
        appUser:'Fininsights'
      },
      {
        id:'1001',
        name:'Jhon Alvarado',
        email:'a.a@.a',
        role:'Administrador',
        appUser:'Alivoice'
      },
      {
        id:'1002',
        name:'Esteban Meza',
        email:'a.a@.a',
        role:'Administrador',
        appUser:'Fininsights'
      },
      {
        id:'1003',
        name:'Guillermo Rodolfo',
        email:'a.a@.a',
        role:'Consultant',
        appUser:'Alivoice'
      },
      {
        id:'1004',
        name:'Emiliano Rodriguez',
        email:'a.a@.a',
        role:'Consultant',
        appUser:'Fininsights'
      },
      {
        id:'1005',
        name:'Jhon Alvarado',
        email:'a.a@.a',
        role:'Administrador',
        appUser:'Alivoice'
      },
      {
        id:'1006',
        name:'Esteban Meza',
        email:'a.a@.a',
        role:'Administrador',
        appUser:'Fininsights'
      },
      {
        id:'1007',
        name:'Guillermo Rodolfo',
        email:'a.a@.a',
        role:'Consultant',
        appUser:'Alivoice'
      }
    ];
  }
  getUsers(){
    return Promise.resolve(this.getUsersData());
  }
}
