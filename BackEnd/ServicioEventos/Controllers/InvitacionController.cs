using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicioEventos.Modelo;

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

            return Ok(confirmacion);
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
