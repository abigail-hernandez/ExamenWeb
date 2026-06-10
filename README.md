# Examen Web SPA — Eventos

Aplicación full-stack de venta de boletos para eventos.

- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind 4 (`app/`, `components/`, `lib/`).
- **Backend:** ASP.NET Core (.NET 9) con arquitectura por capas (`backend/EventosSPA.*`), EF Core + SQLite y autenticación JWT.
- El frontend consume el backend desde [`lib/api.ts`](lib/api.ts) usando la variable `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:5172`).

## Requisitos

- Node.js 18+ y npm
- .NET SDK 9.0

## 1) Levantar el backend (.NET)

```bash
cd backend/EventosSPA.API
dotnet restore
dotnet run
```

- La API queda en `http://localhost:5172` (perfil `http`).
- Swagger disponible en `http://localhost:5172/swagger`.
- Al arrancar aplica migraciones de EF Core y crea automáticamente la base SQLite `eventos.db`.

## 2) Levantar el frontend (Next.js)

Desde la raíz del repositorio:

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
# o
npm run build && npm start   # producción
```

Para apuntar a un backend distinto, crea un archivo `.env.local` en la raíz:

```
NEXT_PUBLIC_API_URL=http://localhost:5172
```

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Registro (`role`: `Customer` o `Admin`) |
| POST | `/api/auth/login` | — | Login, devuelve `{ token }` (JWT) |
| GET  | `/api/events?search=` | — | Lista de eventos activos |
| POST | `/api/events` | Admin | Crear evento con zonas |
| POST | `/api/tickets/purchase` | Usuario | Comprar boletos |
| GET  | `/api/tickets/dashboard` | Admin | Resumen de ventas |

## Probar la app (no hay usuarios precargados)

La base arranca vacía. Crea tus usuarios desde la pantalla de registro (`/register`),
que incluye un selector **Cliente / Administrador**:

1. **Cliente** → registrarse como "Cliente" → puede ver eventos y comprar boletos.
2. **Administrador** → registrarse como "Administrador" → accede a `/admin`
   (crear eventos) y a `/admin/dashboard` (ventas).

También puedes registrar un admin vía Swagger o `curl`:

```bash
curl -X POST http://localhost:5172/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@demo.com","password":"admin123","role":"Admin"}'
```

> Las contraseñas se almacenan con BCrypt; el JWT expira a las 24 h.
