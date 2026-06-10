using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EventosSPA.Application.DTOs;
using EventosSPA.Application.Interfaces;
using EventosSPA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EventosSPA.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    
    // Llave secreta harcodeada temporalmente para pruebas sencillas, debe tener mínimo 32 caracteres
    private const string JwtSecret = "EstaEsUnaLlaveSuperSecretaYMuyLargaParaElExamenWeb2026!"; 

    public AuthService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> RegisterAsync(RegisterDto dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (userExists) throw new Exception("El correo ya está registrado.");

        // Encriptar contraseña usando BCrypt
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = dto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "Usuario registrado exitosamente.";
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new Exception("Credenciales incorrectas.");
        }

        // Generar Token JWT real
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(JwtSecret);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role) // Aquí va "Admin" o "Customer"
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}