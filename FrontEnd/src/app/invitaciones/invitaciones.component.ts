import { Component, PipeTransform, inject, TemplateRef } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

interface Invitado {
  ID:number;
	Nombre: string;
	TotalInvitados: number;
	InvitadosAdultos: number;
	InvitadosMenores: number;
	TotalInvitadosConfirmados: number;
	InvitadosAdultosConfirmados: number;
	InvitadosMenoresConfirmados: number;
	Estado: string;
}

const INVITADOS: Invitado[] = [
	{
    ID:1,
		Nombre: 'Invitado 1',
		TotalInvitados: 1,
		InvitadosAdultos: 1,
		InvitadosMenores: 0,
    TotalInvitadosConfirmados: 1,
    InvitadosAdultosConfirmados: 1,
    InvitadosMenoresConfirmados: 0,
		Estado: 'Sin confirmar',
	},
	{
    ID:2,
		Nombre: 'Invitado 2',
		TotalInvitados: 1,
		InvitadosAdultos: 1,
		InvitadosMenores: 0,
    TotalInvitadosConfirmados: 1,
    InvitadosAdultosConfirmados: 1,
    InvitadosMenoresConfirmados: 0,
		Estado: 'Sin confirmar',
	},
	{
    ID:3,
		Nombre: 'Invitado 2',
		TotalInvitados: 2,
		InvitadosAdultos: 1,
		InvitadosMenores: 1,
    TotalInvitadosConfirmados: 2,
    InvitadosAdultosConfirmados: 1,
    InvitadosMenoresConfirmados: 1,
		Estado: 'Confirmado',
	},
	{
    ID:4,
		Nombre: 'Invitado 3',
		TotalInvitados: 3,
		InvitadosAdultos: 1,
		InvitadosMenores: 2,
    TotalInvitadosConfirmados: 2,
    InvitadosAdultosConfirmados: 1,
    InvitadosMenoresConfirmados: 1,
		Estado: 'Sin confirmar',
	},
];

function search(text: string, pipe: PipeTransform): Invitado[] {
	return INVITADOS.filter((invitado) => {
		const term = text.toLowerCase();
		return (
			invitado.Nombre.toLowerCase().includes(term) ||
			pipe.transform(invitado.Estado).includes(term) ||
			pipe.transform(invitado.TotalInvitados).includes(term)
		);
	});
}

@Component({
  selector: 'app-invitaciones',
  standalone: true,
  imports: [MatCardModule, DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, NgbDatepickerModule],
  templateUrl: './invitaciones.component.html',
  styleUrl: './invitaciones.component.css',
	providers: [DecimalPipe],
})
export class InvitacionesComponent {
  private modalService = inject(NgbModal);
  closeResult = '';
  invitados$: Observable<Invitado[]>;
	filter = new FormControl('', { nonNullable: true });

	constructor(pipe: DecimalPipe) {
		this.invitados$ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);
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
  
}
