import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export default class IndicatorService {

  private baseUrl = 'https://assistantapi-840731636900.us-central1.run.app/Dashboard'
  constructor(private httpClient: HttpClient) { }

  getData(){
    return this.httpClient.get(`${this.baseUrl}/getGraph`);
  }
}
