import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoDescriptivo',
  standalone: true, // Hacer el pipe standalone
})
export class EstadoDescriptivoPipe implements PipeTransform {
  transform(estado: string, fechaExpiracion?: Date): string {
    const hoy = new Date();
    if (estado === 'P') {
      return fechaExpiracion && fechaExpiracion < hoy ? 'Expirada' : 'Pendiente';
    }
    return 'Confirmada';
  }
}
