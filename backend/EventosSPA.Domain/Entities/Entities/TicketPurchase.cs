namespace EventosSPA.Domain.Entities;

public class TicketPurchase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public Guid TicketZoneId { get; set; }
    public Guid UserId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

    // Propiedades de navegación de EF Core
    public Event? Event { get; set; }
    public TicketZone? TicketZone { get; set; }
    public User? User { get; set; }
}