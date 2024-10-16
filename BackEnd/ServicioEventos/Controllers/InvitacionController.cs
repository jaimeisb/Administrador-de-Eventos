using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicioEventos.Modelo;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ServicioEventos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvitacionController : Controller
    {
        private readonly AdminEventosContext _context;
        public InvitacionController(AdminEventosContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvitacion(int id)
        {
            var invitacion = await _context.Invitacions.FindAsync(id);

            if (invitacion == null)
            {
                return NotFound();
            }

            return Ok(invitacion);
        }

        // GET: api/Evento/5
        [HttpGet("InvitacionesEvento")]
        public async Task<ActionResult<IEnumerable<Invitacion>>> ObtenerInvitaciones(int idEvento)
        {
            return await _context.Invitacions.Include(x => x.InvitacionConfirmacion).Where(x => x.IdEvento == idEvento).ToListAsync();
        }

        [HttpPost("crear")]
        public async Task<IActionResult> CrearInvitacion([FromBody] Invitacion nuevaInvitacion)
        {
            _context.Invitacions.Add(nuevaInvitacion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetInvitacion), new { id = nuevaInvitacion.IdInvitacion }, nuevaInvitacion);
        }

        [HttpPost("{id}/confirmar")]
        public async Task<IActionResult> ConfirmarInvitacion(int id, [FromBody] InvitacionConfirmacion confirmacion)
        {
            var invitacion = await _context.Invitacions.AsNoTracking().FirstOrDefaultAsync(i => i.IdInvitacion == id);
            if (invitacion == null)
            {
                return NotFound();
            }
            invitacion.Estado = "C";
            confirmacion.IdInvitacionNavigation = null;
            // Asignar el Id de la invitación a la confirmación
            confirmacion.IdInvitacion = id;

            // Adjuntar la entidad a la tabla de confirmaciones sin rastrear la invitación principal.

            _context.InvitacionConfirmacions.Add(confirmacion);
            _context.Invitacions.Update(invitacion);
            await _context.SaveChangesAsync();

            var evento = _context.Eventos.FirstOrDefault(x => x.IdEvento == invitacion.IdEvento);
            if (evento != null)
            {
                string destinatario = evento.Correo;  // Asegúrate de tener el email del invitado
                string asunto = "Confirmación de Invitación";
                string cuerpo = $"<p>Hola,</p> <p>Tu invitación para {invitacion.Nombre} ha sido confirmada exitosamente.</p> <br> <p>Personas confirmadas: {confirmacion.AdultosConfirmados} adultos, {confirmacion.MenoresConfirmados} niños. </p>";

                try
                {
                    await EnviarCorreoAsync(destinatario, asunto, cuerpo);
                }
                catch (Exception ex)
                {
                    // Manejo de errores de envío de correo
                    //return StatusCode(500, $"Error al enviar correo: {ex.Message}");
                }
            }

            return Ok(confirmacion);
        }


        private async Task EnviarCorreoAsync(string destinatario, string asunto, string cuerpo)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("soporte.jwsolutions@gmail.com", "xcdamfwjgwrsfnlw"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("soporte.jwsolutions@gmail.com"),
                Subject = asunto,
                Body = cuerpo,
                IsBodyHtml = true, // Si el cuerpo contiene HTML
            };
            mailMessage.To.Add(destinatario);

            await smtpClient.SendMailAsync(mailMessage);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarInvitacion(int id)
        {
            var invitacion = await _context.Invitacions.FindAsync(id);
            if (invitacion == null)
            {
                return NotFound();
            }

            _context.Invitacions.Remove(invitacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarInvitacion(int id, [FromBody] Invitacion invitacionEditada)
        {
            if (id != invitacionEditada.IdInvitacion)
            {
                return BadRequest();
            }

            _context.Entry(invitacionEditada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvitacionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool InvitacionExists(int id)
        {
            return _context.Invitacions.Any(e => e.IdInvitacion == id);
        }

    }
}
