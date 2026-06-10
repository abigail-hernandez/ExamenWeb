namespace EventosSPA.Domain.Entities;

public class TicketZone
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string Name { get; set; } = string.Empty; 
    public decimal Price { get; set; }
    public int TotalCapacity { get; set; }
    public int TicketsSold { get; set; }

    // Propiedad calculada para saber la disponibilidad en tiempo real
    public int AvailableTickets => TotalCapacity - TicketsSold;
    
    // Propiedad de navegación para Entity Framework
    public Event? Event { get; set; }
}
