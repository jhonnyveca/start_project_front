import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getBussinessRoles(projectId: any,page:string, per_page:string): Observable<any>{
    const params = new HttpParams()
      .set('page', page)
      .set('per_page', per_page);
    return this.http.get<any>(`${this.apiURL}/${projectId}/BusinessDomainRols/`, {params:params}).pipe()
  }


  getRolesData(){
    return [
      {
        id:'1',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'1',
        codOficinaVenta:'VE05',
        desRol:'VTP_COM_ECUADOR',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'2',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'2',
        codOficinaVenta:'VE04',
        desRol:'VTP_COM_ECUADOR',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'3',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'3',
        codOficinaVenta:'VE03',
        desRol:'VTP_COM_ECUADOR',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'4',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'4',
        codOficinaVenta:'VE02',
        desRol:'VTP_COM_CAM',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'5',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'5',
        codOficinaVenta:'VE01',
        desRol:'VTP_COM_CAM',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'6',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'6',
        codOficinaVenta:'VE05',
        desRol:'VTP_COM_CAM',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'7',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'7',
        codOficinaVenta:'VE04',
        desRol:'VTP_COM_PECES',
        desArea:'COMERCIAL',
        desNegocio:'Vitapro'
      },
      {
        id:'8',
        codSegmento:'S001',
        codSociedad:'EC13,PE12,HN12',
        codJerarquiaPais:'BO',
        codSubnegocio:'ASP',
        codPlataforma:'8',
        codOficinaVenta:'VE03',
        desRol:'VTP_COM_CAM',
        desArea:'FINANZAS',
        desNegocio:'Vitapro'
      }
    ];
  }
  getRoles(){
    return Promise.resolve(this.getRolesData());
  }
}
