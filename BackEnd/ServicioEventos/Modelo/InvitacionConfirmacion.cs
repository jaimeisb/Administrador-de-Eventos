using System;
using System.Collections.Generic;

namespace ServicioEventos.Modelo;

public partial class InvitacionConfirmacion
{
    public int IdInvitacion { get; set; }

    public int? AdultosConfirmados { get; set; }

    public int? MenoresConfirmados { get; set; }

    public virtual Invitacion IdInvitacionNavigation { get; set; } = null!;
}
