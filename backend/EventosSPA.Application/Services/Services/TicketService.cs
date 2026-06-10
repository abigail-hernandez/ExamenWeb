using EventosSPA.Application.DTOs;
using EventosSPA.Application.Interfaces;
using EventosSPA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventosSPA.Application.Services;

public class TicketService
{
    private readonly IApplicationDbContext _context;

    public TicketService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PurchaseResponseDto> PurchaseTicketsAsync(PurchaseTicketDto dto)
    {
        var targetEvent = await _context.Events.FindAsync(dto.EventId);
        if (targetEvent == null || !targetEvent.IsActive)
            throw new Exception("El evento no existe o fue cancelado.");

        var zone = await _context.TicketZones
            .FirstOrDefaultAsync(z => z.Id == dto.TicketZoneId && z.EventId == dto.EventId);

        if (zone == null)
            throw new Exception("La zona seleccionada no pertenece a este evento.");

        // Validación de disponibilidad estricta
        if (zone.AvailableTickets < dto.Quantity)
            throw new Exception($"Cupo insuficiente. Solo quedan {zone.AvailableTickets} boletos.");

        // Requerimiento: Calcular Total = Precio x Cantidad
        decimal total = zone.Price * dto.Quantity;
        zone.TicketsSold += dto.Quantity;

        var purchase = new TicketPurchase
        {
            EventId = dto.EventId,
            TicketZoneId = dto.TicketZoneId,
            UserId = dto.UserId,
            Quantity = dto.Quantity,
            TotalPrice = total
        };

        _context.TicketPurchases.Add(purchase);
        await _context.SaveChangesAsync();

        return new PurchaseResponseDto(
            purchase.Id,
            targetEvent.Name,
            zone.Name,
            purchase.Quantity,
            purchase.TotalPrice,
            purchase.PurchaseDate
        );
    }

    public async Task<DashboardDto> GetDashboardDataAsync()
    {
        var totalRevenue = await _context.TicketPurchases.SumAsync(p => p.TotalPrice);
        var totalTickets = await _context.TicketPurchases.SumAsync(p => p.Quantity);

        var topEvents = await _context.TicketPurchases
            .Include(p => p.Event)
            .GroupBy(p => p.Event!.Name)
            .Select(g => new EventSalesSummaryDto(
                g.Key,
                g.Sum(p => p.Quantity),
                g.Sum(p => p.TotalPrice)
            ))
            .OrderByDescending(e => e.TotalRevenue)
            .Take(5)
            .ToListAsync();

        return new DashboardDto(totalRevenue, totalTickets, topEvents);
    }
}