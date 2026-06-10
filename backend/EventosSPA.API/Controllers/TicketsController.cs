using EventosSPA.Application.DTOs;
using EventosSPA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventosSPA.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TicketsController : ControllerBase
{
    private readonly TicketService _ticketService;

    public TicketsController(TicketService ticketService) { _ticketService = ticketService; }

    [Authorize] // Cualquier usuario logueado puede comprar
    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase(PurchaseTicketDto dto)
    {
        try { return Ok(await _ticketService.PurchaseTicketsAsync(dto)); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }

    [Authorize(Roles = "Admin")] // Dashboard protegido
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        return Ok(await _ticketService.GetDashboardDataAsync());
    }
}