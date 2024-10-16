export interface Invitacion {
    idInvitacion: number;
    idEvento: number;
    nombre: string;
    adultos: number;
    menores: number;
    fechaExpiracion: Date;
    estado: string;
    invitacionConfirmacion: invitacionConfirmacion|null;
    telefono:string;
  }
  
  export interface invitacionConfirmacion{
    adultosConfirmados: number;
    menoresConfirmados: number;
    idInvitacion: number;
  }

  export interface Evento{
    correo: string;
    mensajeInvitacion: string;
    anfitrion: string;
    idEvento: number;
    fecha: string;
  }