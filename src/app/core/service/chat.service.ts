import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat} from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiURL = 'https://assistantapi-840731636900.us-central1.run.app/Asisstant';

  constructor(private http: HttpClient) { }

  sendMenssage(chat:Chat){
    return this.http.post(`${this.apiURL}/processQuestion`,chat)
  }

}
