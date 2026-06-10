namespace EventosSPA.Application.DTOs;

public record CreateZoneDto(string Name, decimal Price, int TotalCapacity);

public record CreateEventDto(
    string Name, 
    string Description, 
    DateTime Date, 
    string Venue, 
    List<CreateZoneDto> Zones
);

public record ZoneResponseDto(Guid Id, string Name, decimal Price, int TotalCapacity, int TicketsSold, int AvailableTickets);

public record EventResponseDto(
    Guid Id, 
    string Name, 
    string Description, 
    DateTime Date, 
    string Venue, 
    bool IsActive, 
    List<ZoneResponseDto> Zones
);