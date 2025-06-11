import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiURL = 'https://assistantapi-840731636900.us-central1.run.app';

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
