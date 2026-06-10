using EventosSPA.Application.DTOs;
using EventosSPA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventosSPA.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly EventService _eventService;

    public EventsController(EventService eventService) { _eventService = eventService; }

    [HttpGet] // Público: Cualquiera puede ver eventos
    public async Task<IActionResult> Get([FromQuery] string? search)
    {
        return Ok(await _eventService.GetActiveEventsAsync(search));
    }

    [Authorize(Roles = "Admin")] // Protegido: Solo Admin
    [HttpPost]
    public async Task<IActionResult> Create(CreateEventDto dto)
    {
        try { return Ok(new { id = await _eventService.CreateEventAsync(dto) }); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }
}