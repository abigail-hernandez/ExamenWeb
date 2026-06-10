using EventosSPA.Application.DTOs;
using EventosSPA.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventosSPA.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) { _authService = authService; }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try { return Ok(new { message = await _authService.RegisterAsync(dto) }); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try { return Ok(new { token = await _authService.LoginAsync(dto) }); }
        catch (Exception ex) { return Unauthorized(new { error = ex.Message }); }
    }
}