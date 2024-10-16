import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../Servicios/evento.service';
import { Evento } from '../../Modelos/invitacion';
import { HttpClientModule } from '@angular/common/http';
import { Alerta } from '../Alertas/Alerta.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule ],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css',
	providers: [EventoService]
})
export class EventoComponent {
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  Evento:Evento;
  fechaFormateada = '';
  isLoading: boolean = false; // Controla la visibilidad del spinner

  constructor(private eventoService: EventoService){
    this.Evento = {correo:'',anfitrion:'',fecha:'',idEvento:0,mensajeInvitacion:''}
    this.isLoading = true; // Mostrar el spinner
    this.eventoService.getEvento(2).subscribe({
      next: (data) => {
        console.log(data);
        // Puedes realizar alguna transformación aquí si es necesario
        this.Evento = data;
        this.fechaFormateada = this.Evento.fecha.replace('T', ' ');
      },
      complete: () => {
        // Acciones cuando la suscripción se completa
        this.isLoading = false; 
      }
    });

  }

  ActualizarEvento(){
    
    this.isLoading = true; // Mostrar el spinner
    this.eventoService.AddCorreoEvento(this.Evento.idEvento, this.Evento).subscribe({
      next: (respuesta) => {
        this._snackBar.openFromComponent(Alerta, {
          data: 'Datos actualizados correctamente',
          duration: this.durationInSeconds * 1000,
        });
      },
      error: (error) => {
        // Manejo de error
        console.log(error)
        this._snackBar.openFromComponent(Alerta, {
          data: 'Error al actualizar los datos:' + error,
          duration: this.durationInSeconds * 1000,
        });
      },
      complete: () => {
        // Acciones cuando la suscripción se completa
        this.isLoading = false; 
      }
    });
  }
}
