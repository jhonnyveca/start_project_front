import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'https://assistantapi-840731636900.us-central1.run.app';

  constructor(private http: HttpClient) { }

  login(idProject:number, data: any): Observable<any> {
    console.log("Request: "+data);
    return this.http.post<any>(`${this.apiURL}/${idProject}/Users/authUser`, data).pipe(
      tap(response => {
        if (response) {
          console.log("Data response: "+response);
        }
      })
    )
  }

  getAccessUser(idProject:number, idUser: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${idProject}/Users/${idUser}`)
  }

}
