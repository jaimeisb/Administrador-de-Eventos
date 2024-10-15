import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, Invitacion } from '../Modelos/invitacion';


@Injectable({
  providedIn: 'root'
})
export class InvitacionService {
  private apiUrl = 'https://localhost:7080/api/Invitacion';  // URL base de la API
  constructor(private http: HttpClient) { }

  // Método para obtener todas las invitaciones
  getInvitaciones(idEvento: number): Observable<Invitacion[]> {
    const url = `${this.apiUrl}/InvitacionesEvento?idEvento=${idEvento}`;
    return this.http.get<Invitacion[]>(url);
  }


  // Método para obtener una invitación por ID
  getInvitacion(id: number): Observable<Invitacion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Invitacion>(url);
  }

    // Método para obtener una invitación por ID
    getEvento(id: number): Observable<Evento> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Evento>(url);
    }

  // Método para crear una invitación
  crearInvitacion(invitacion: Invitacion): Observable<Invitacion> {
    return this.http.post<Invitacion>(`${this.apiUrl}/crear`, invitacion, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Método para actualizar una invitación
  editarInvitacion(id: number, invitacion: Invitacion): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, invitacion, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Método para borrar una invitación
  borrarInvitacion(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Método para confirmar una invitación
  confirmarInvitacion(id: number, confirmacion: any): Observable<any> {
    const url = `${this.apiUrl}/${id}/confirmar`;
    return this.http.post<any>(url, confirmacion, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
