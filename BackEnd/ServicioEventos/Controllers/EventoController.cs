using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicioEventos.Modelo;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServicioEventos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : Controller
    {
        private readonly AdminEventosContext _context;
        public EventoController(AdminEventosContext context)
        {
            _context = context;
        }

        // GET: api/Evento/Test
        [HttpGet("Test")]
        public ActionResult<string> Test()
        {
            return "Hola mundo";
        }


        // GET: api/Evento
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evento>>> GetEventos()
        {
            return await _context.Eventos.ToListAsync();
        }

        // GET: api/Evento/5
        [HttpGet("{idEvento}")]
        public async Task<ActionResult<Evento>> GetDatosEvento(int idEvento)
        {
            return await _context.Eventos.FirstOrDefaultAsync(x => x.IdEvento == idEvento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarEvento(int id, [FromBody] Evento eventoEditado)
        {
            if (id != eventoEditado.IdEvento)
            {
                return BadRequest();
            }

            _context.Entry(eventoEditado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventoExists(id))
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
        private bool EventoExists(int id)
        {
            return _context.Eventos.Any(e => e.IdEvento == id);
        }
    }
}
