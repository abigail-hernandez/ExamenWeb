using EventosSPA.Application.DTOs;

namespace EventosSPA.Application.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterDto dto);
    Task<string> LoginAsync(LoginDto dto); // Devolverá el JWT
}