import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export default class IndicatorService {
  
  private apiURL = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getData(){
    return this.httpClient.get(`${this.apiURL}/Dashboard/getGraph`);
  }
}
