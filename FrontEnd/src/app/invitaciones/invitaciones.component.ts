import { Component, PipeTransform, inject, TemplateRef } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { InvitacionService } from '../../Servicios/invitacion.service';

import { HttpClientModule } from '@angular/common/http';
import { Invitacion } from '../../Modelos/invitacion';
import { Clipboard,ClipboardModule  } from '@angular/cdk/clipboard';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { Alerta } from '../Alertas/Alerta.component';
import { EstadoDescriptivoPipe } from '../../Modelos/estado-descriptivo.pipe';
import { Modal } from 'bootstrap';



@Component({
  selector: 'app-invitaciones',
  standalone: true,
  imports: [FormsModule, MatCardModule, DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, NgbDatepickerModule, HttpClientModule, NgbTooltipModule, ClipboardModule, EstadoDescriptivoPipe ],
  templateUrl: './invitaciones.component.html',
  styleUrl: './invitaciones.component.css',
	providers: [DecimalPipe, InvitacionService],
})

export class InvitacionesComponent {

  invitados: any[] = [];
  private modalService = inject(NgbModal);
  invitacionForm: FormGroup;
  closeResult = '';
  invitados$: Observable<Invitacion[]> = new Observable<Invitacion[]>;
  filteredInvitados$: Observable<Invitacion[]>; // Observable de invitados filtrados
	filter = new FormControl('', { nonNullable: true });

  totalConfirmados = 0;
  totalSinConfirmar = 0;
  totalAdultos$: number = 0;
  totalMenores$: number = 0;
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;

  invitacionXEditar:Invitacion;

	constructor(private invitacionService: InvitacionService,private fb: FormBuilder, private clipboard: Clipboard) {
    this.invitacionXEditar={idInvitacion:0, adultos:0, estado:'',fechaExpiracion:new Date,idEvento:0,menores:0,nombre:'',invitacionConfirmacion: null }
    this.getInvitaciones();  // Llama al método para obtener las invitaciones
		// Filtrar los invitados en base al input
    this.filteredInvitados$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap((text) => this.filterInvitados(text))
    );

    this.invitacionForm = this.fb.group({
      IdEvento:[2],
      Nombre: ['', Validators.required],
      FechaExpiracion: [''],
      Adultos: [0, [Validators.required, Validators.min(1)]],
      Menores: [0],
      Estado:['P']
    });
	}

  // Método para filtrar los invitados
  private filterInvitados(text: string): Observable<Invitacion[]> {
    return this.invitados$.pipe(
      map(invitados => {
        const term = text.toLowerCase();
        return invitados.filter(invitado =>
          invitado.nombre.toLowerCase().includes(term) || 
          // Agrega otras propiedades para filtrar según lo necesites
          (this.estadoDescriptivo(invitado).toLowerCase().includes(term) ||
          (invitado.invitacionConfirmacion && 
          ((invitado.invitacionConfirmacion.adultosConfirmados + 
          invitado.invitacionConfirmacion.menoresConfirmados).toString().includes(term))))
        );
      })
    );
  }

  private estadoDescriptivo(invitado: Invitacion): string {
    if (invitado.estado === 'P') {
      return this.getFechaLocalString(invitado.fechaExpiracion) < this.getFechaLocal()
        ? 'Expirada'
        : 'Pendiente';
    }
    return 'Confirmada';
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();  // Previene la acción predeterminada del Enter
    }
  }

  ngOnInit(): void {
    
  }

  // Método para obtener las invitaciones desde la API
  getInvitaciones(): void {
    this.invitados$ = this.invitacionService.getInvitaciones(2).pipe(
      map((data) => {
        
        this.totalConfirmados = data.filter(inv => inv.estado === 'C').length;
        this.totalSinConfirmar = data.filter(inv => inv.estado === 'P').length;
        this.totalAdultos$ = data.reduce((total, invitado) => total + (invitado.invitacionConfirmacion?.adultosConfirmados??0), 0);
        this.totalMenores$ = data.reduce((total, invitado) => total + (invitado.invitacionConfirmacion?.menoresConfirmados??0), 0);
         
        console.log(data);
        // Puedes realizar alguna transformación aquí si es necesario
        return data;
      })
    );
    this.filteredInvitados$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap((text) => this.filterInvitados(text))
    );
  }

  // Método para crear una invitación
  crearInvitacion(): void {
    if (this.invitacionForm.valid) {
      const nuevaInvitacion = this.invitacionForm.value;
      this.invitacionService.crearInvitacion(nuevaInvitacion).subscribe({
        next: (respuesta) => {
          this.getInvitaciones();
         // Realiza las acciones que necesites después de crear la orden de trabajo
          this.invitacionForm.patchValue({
            IdEvento: 2,
            Nombre: '',
            FechaExpiracion: this.getFechaLocal(),
            Adultos: 0,
            Menores: 0,
            Estado:'P'
          });
          this.modalService.dismissAll();

          this._snackBar.openFromComponent(Alerta, {
            data: 'Invitación creada correctamente',
            duration: this.durationInSeconds * 1000,
          });
        },
        error: (error) => {
          // Manejo de error
          this._snackBar.openFromComponent(Alerta, {
            data: 'Error al crear la invitacion:' + error,
            duration: this.durationInSeconds * 1000,
          });
        },
        complete: () => {
          // Acciones cuando la suscripción se completa
        }
      });
    }
  }


  // Método para eliminar una invitación
  eliminarInvitacion(id: number): void {
    this.invitacionService.borrarInvitacion(id).subscribe({
      next: (respuesta) => {
        this.getInvitaciones();
        this._snackBar.openFromComponent(Alerta, {
          data: 'Invitación eliminada correctamente',
          duration: this.durationInSeconds * 1000,
        });
      },
      error: (error) => {
        // Manejo de error
        this._snackBar.openFromComponent(Alerta, {
          data: 'Error al eliminar la invitacion:' + error,
          duration: this.durationInSeconds * 1000,
        });
      },
      complete: () => {
        // Acciones cuando la suscripción se completa
      }
    });
  }

  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
  
  getFechaLocal(){
    const fechaActual = new Date();
    fechaActual.setUTCHours(fechaActual.getUTCHours() - 6);
    return new Date();
  }
  getFechaLocalString(date:any){
    return new Date(date);
  }

  TotalInvitaciones (){
    this.invitados$.pipe(
      map((invitados) => {
        const confirmados = invitados.filter(invitado => invitado.estado === 'C').length;
        const sinConfirmar = invitados.filter(invitado => invitado.estado === 'P').length;
        return { confirmados, sinConfirmar };
      })
    ).subscribe((counts) => {
      return (`Invitados confirmados: ${counts.confirmados}, Sin confirmar: ${counts.sinConfirmar}`);
    });
    
  }

  GetLinkInvitacion(id:any) {
    let link = 'http://localhost:4200/home/'+ id;
    this.clipboard.copy(link);
    this._snackBar.openFromComponent(Alerta, {
      data: `Link ${link} copiado al portapapeles.`,
      duration: this.durationInSeconds * 1000,
    });
  }

  GetInvitacionPorId(
    invitados$: Observable<Invitacion[]>, 
    id: number
  ): Observable<Invitacion | undefined> {
    return invitados$.pipe(
      map((invitados) => invitados.find((invitado) => invitado.idInvitacion === id))
    );
  }

  editarInvitacion(id: number): void {
    this.GetInvitacionPorId(this.invitados$, id).subscribe((element) => {
      this.invitacionXEditar = element as Invitacion;
      const modal = new Modal('#editModal');
      modal.show();
    });
    
  }

  ActualizarInvitacion(){
    
    const modalElement = document.getElementById('editModal');
    const modal = Modal.getInstance(modalElement!) || new Modal(modalElement!);
      this.invitacionService.editarInvitacion(this.invitacionXEditar.idInvitacion, this.invitacionXEditar).subscribe({
        next: (respuesta) => {
          this.getInvitaciones();
          modal.hide(); // Cierra el modal aquí
          this._snackBar.openFromComponent(Alerta, {
            data: 'Invitación editada correctamente',
            duration: this.durationInSeconds * 1000,
          });
        },
        error: (error) => {
          // Manejo de error
          modal.hide(); // Cierra el modal aquí
          this._snackBar.openFromComponent(Alerta, {
            data: 'Error al editar la invitación:' + error,
            duration: this.durationInSeconds * 1000,
          });
        },
        complete: () => {
          // Acciones cuando la suscripción se completa
          
        }
      });
  }
}
