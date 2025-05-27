import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat} from '../models/chat';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiURL = 'https://assistantapi-840731636900.us-central1.run.app';

  constructor(private http: HttpClient) { }

  sendMenssage(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/Asisstant/processQuestion`, data).pipe(
      catchError(error => {
        console.error('Error en la petición:', error);
        // Puedes devolver un objeto con estructura consistente incluso en errores
        return throwError(() => new Error('Error en la comunicación con el servidor'));
      })
    );
  }

}
