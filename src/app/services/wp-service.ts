import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl = 'https://ms-wp-361330255571.us-central1.run.app';

  constructor(private http: HttpClient) { }

  sendMessage(name: string, code: string, to: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name, code, to };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}

