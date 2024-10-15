using System;
using System.Collections.Generic;

namespace ServicioEventos.Modelo;

public partial class Evento
{
    public int IdEvento { get; set; }

    public string? Anfitrion { get; set; }

    public DateTime? Fecha { get; set; }

    public string? Correo { get; set; }

    public string? MensajeInvitacion { get; set; }

    public virtual ICollection<Invitacion> Invitacions { get; set; } = new List<Invitacion>();
}
