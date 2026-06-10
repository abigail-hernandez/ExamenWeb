using EventosSPA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventosSPA.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Event> Events { get; }
    DbSet<TicketZone> TicketZones { get; }
    DbSet<TicketPurchase> TicketPurchases { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
