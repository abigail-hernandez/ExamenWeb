namespace EventosSPA.Application.DTOs;

public record PurchaseTicketDto(Guid EventId, Guid TicketZoneId, Guid UserId, int Quantity);

public record PurchaseResponseDto(
    Guid PurchaseId, 
    string EventName, 
    string ZoneName, 
    int Quantity, 
    decimal TotalPrice, 
    DateTime PurchaseDate
);

// DTO para el Dashboard de ventas extra
public record EventSalesSummaryDto(string EventName, int TotalTicketsSold, decimal TotalRevenue);

public record DashboardDto(
    decimal TotalRevenueAllTime,
    int TotalTicketsSoldAllTime,
    List<EventSalesSummaryDto> TopEvents
);