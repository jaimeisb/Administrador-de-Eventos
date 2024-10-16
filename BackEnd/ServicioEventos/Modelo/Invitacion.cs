using System;
using System.Collections.Generic;

namespace ServicioEventos.Modelo;

public partial class Invitacion
{
    public int IdInvitacion { get; set; }

    public int? IdEvento { get; set; }

    public string? Nombre { get; set; }

    public int? Adultos { get; set; }

    public int? Menores { get; set; }

    public DateTime? FechaExpiracion { get; set; }

    public string? Estado { get; set; }

    public string? Telefono { get; set; }

    public virtual Evento? IdEventoNavigation { get; set; }

    public virtual InvitacionConfirmacion? InvitacionConfirmacion { get; set; }
}
