using EventosSPA.Application.Interfaces;
using EventosSPA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventosSPA.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<TicketZone> TicketZones => Set<TicketZone>();
    public DbSet<TicketPurchase> TicketPurchases => Set<TicketPurchase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de precisión para los precios (evita problemas con SQLite/EF)
        modelBuilder.Entity<TicketZone>()
            .Property(z => z.Price)
            .HasConversion<double>();

        modelBuilder.Entity<TicketPurchase>()
            .Property(p => p.TotalPrice)
            .HasConversion<double>();
    }
}