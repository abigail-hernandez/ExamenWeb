namespace EventosSPA.Application.DTOs;

public record RegisterDto(string Username, string Email, string Password, string Role = "Customer");
public record LoginDto(string Email, string Password);