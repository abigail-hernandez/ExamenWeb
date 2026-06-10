namespace EventosSPA.Domain.Entities;

public class Event
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Venue { get; set; } = string.Empty; 
    public bool IsActive { get; set; } = true;

    // Relación uno a muchos: Un evento tiene muchas zonas de boletos
    public List<TicketZone> Zones { get; set; } = new();
}
