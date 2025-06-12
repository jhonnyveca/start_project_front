import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendMenssage(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/Assistant/processQuestion`, data).pipe(
      catchError(error => {
        console.error('Error en la petición:', error);
        return throwError(() => new Error('Error en la comunicación con el servidor'));
      })
    );
  }

  getChatHistory(userId:string, projectId:string): Observable<any> {
    const params = new HttpParams()
    .set('id_user', userId)
    .set('id_project', projectId);

    return this.http.get<any>(`${this.apiURL}/Assistant/getUserElements`, {params: params}).pipe()
  }

  getChatMessages(userId:number, projectId:number, chatId:number): Observable<any> {
    const params = new HttpParams()
      .set('id_user', userId)
      .set('id_project', projectId)
      .set('id_chat', chatId);
    return this.http.get<any>(`${this.apiURL}/Assistant/getUserChat`, { params })

  }

}
