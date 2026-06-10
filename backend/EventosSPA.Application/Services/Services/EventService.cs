using EventosSPA.Application.DTOs;
using EventosSPA.Application.Interfaces;
using EventosSPA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventosSPA.Application.Services;

public class EventService
{
    private readonly IApplicationDbContext _context;

    public EventService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateEventAsync(CreateEventDto dto)
    {
        if (dto.Date < DateTime.UtcNow)
            throw new ArgumentException("La fecha del evento no puede ser en el pasado.");

        var newEvent = new Event
        {
            Name = dto.Name,
            Description = dto.Description,
            Date = dto.Date,
            Venue = dto.Venue,
            IsActive = true,
            Zones = dto.Zones.Select(z => new TicketZone
            {
                Name = z.Name,
                Price = z.Price,
                TotalCapacity = z.TotalCapacity,
                TicketsSold = 0
            }).ToList()
        };

        _context.Events.Add(newEvent);
        await _context.SaveChangesAsync();
        return newEvent.Id;
    }

    public async Task<List<EventResponseDto>> GetActiveEventsAsync(string? search)
    {
        var query = _context.Events
            .Include(e => e.Zones)
            .Where(e => e.IsActive);

        // Búsqueda integrada (Requerimiento extra)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(e => e.Name.ToLower().Contains(searchLower) || 
                                     e.Description.ToLower().Contains(searchLower));
        }

        return await query.Select(e => new EventResponseDto(
            e.Id,
            e.Name,
            e.Description,
            e.Date,
            e.Venue,
            e.IsActive,
            e.Zones.Select(z => new ZoneResponseDto(z.Id, z.Name, z.Price, z.TotalCapacity, z.TicketsSold, z.AvailableTickets)).ToList()
        )).ToListAsync();
    }

    public async Task<bool> CancelEventAsync(Guid eventId)
    {
        var targetEvent = await _context.Events.FindAsync(eventId);
        if (targetEvent == null) return false;

        targetEvent.IsActive = false; // Cancelar evento lógicamente
        await _context.SaveChangesAsync();
        return true;
    }
}