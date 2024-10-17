import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../Modelos/invitacion';


@Injectable({
  providedIn: 'root'
})
export class EventoService {
    //private apiUrl = 'https://apiadmineventos.solutionsjw.com/api/Evento';  // URL base de la API
    private apiUrl = 'https://localhost:7080/api/Evento';  
    constructor(private http: HttpClient) { }

    // Método para obtener un evento por ID
    getEvento(id: number): Observable<Evento> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Evento>(url);
    }

     // Método para obtener un evento por ID
     AddCorreoEvento(id: number, evento:Evento): Observable<void> {
        console.log(evento);
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<void>(url, evento, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
        });
    }
}
