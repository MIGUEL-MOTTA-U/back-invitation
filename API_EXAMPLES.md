# API Examples - Guest Management

## POST /guests - Crear invitado con acompañantes

### Ejemplo 1: Invitado con 2 acompañantes
```json
POST /guests
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "1234567890",
  "phoneCountryCode": "+57",
  "message": "¡Nos vemos allí!",
  "confirmed": true,
  "companions": [
    {
      "name": "María García",
      "confirmed": true
    },
    {
      "name": "Pedro López",
      "confirmed": true
    }
  ]
}
```

**Respuesta:**
```json
{
  "message": "The guest was successfully created with 2 companion(s)",
  "status": 201,
  "type": "api-guest",
  "payload": {
    "userId": "uuid-del-invitado-principal"
  }
}
```

### Ejemplo 2: Invitado sin acompañantes
```json
POST /guests
Content-Type: application/json

{
  "name": "Ana Martínez",
  "email": "ana@example.com",
  "confirmed": true
}
```

**Respuesta:**
```json
{
  "message": "The guest was successfully created with id uuid-del-invitado",
  "status": 201,
  "type": "api-guest",
  "payload": {
    "userId": "uuid-del-invitado"
  }
}
```

### Ejemplo 3: Invitado con acompañantes sin confirmar
```json
POST /guests
Content-Type: application/json

{
  "name": "Carlos Rodríguez",
  "email": "carlos@example.com",
  "confirmed": false,
  "companions": [
    {
      "name": "Laura Sánchez",
      "confirmed": false
    }
  ]
}
```

## GET /guests - Obtener todos los invitados con sus acompañantes

```http
GET /guests
```

**Respuesta:**
```json
{
  "message": "All guests with companions retrieved successfully",
  "status": 200,
  "type": "api-guest",
  "payload": {
    "guests": [
      {
        "id": "uuid-1",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "1234567890",
        "phoneCountryCode": "+57",
        "message": "¡Nos vemos allí!",
        "confirmed": true,
        "companions": [
          {
            "id": "uuid-2",
            "name": "María García",
            "confirmed": true
          },
          {
            "id": "uuid-3",
            "name": "Pedro López",
            "confirmed": true
          }
        ]
      },
      {
        "id": "uuid-4",
        "name": "Ana Martínez",
        "email": "ana@example.com",
        "phone": null,
        "phoneCountryCode": null,
        "message": null,
        "confirmed": true,
        "companions": []
      }
    ],
    "statistics": {
      "totalGuests": 2,
      "totalCompanions": 2,
      "totalPeople": 4,
      "confirmedGuests": 2,
      "unconfirmedGuests": 0,
      "confirmedCompanions": 2,
      "unconfirmedCompanions": 0,
      "confirmedPeople": 4,
      "unconfirmedPeople": 0
    }
  }
}
```

## Estructura de datos en la base de datos

La tabla `Guest` ahora almacena tanto invitados principales como acompañantes:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | UUID único |
| name | String | Nombre de la persona |
| email | String? | Email (solo para invitados principales) |
| phone | String? | Teléfono (solo para invitados principales) |
| phoneCountryCode | String? | Código de país del teléfono |
| message | String? | Mensaje del invitado |
| confirmed | Boolean | Si confirmó asistencia |
| **isCompanion** | **Boolean** | **true si es acompañante, false si es invitado principal** |
| **guestId** | **String?** | **ID del invitado principal (solo para acompañantes)** |

### Ejemplo de registros en la tabla:

| id | name | email | confirmed | isCompanion | guestId |
|----|------|-------|-----------|-------------|---------|
| uuid-1 | Juan Pérez | juan@example.com | true | false | null |
| uuid-2 | María García | null | true | true | uuid-1 |
| uuid-3 | Pedro López | null | true | true | uuid-1 |
| uuid-4 | Ana Martínez | ana@example.com | true | false | null |

En este ejemplo:
- **Juan Pérez** es un invitado principal con 2 acompañantes
- **María García** y **Pedro López** son acompañantes de Juan Pérez
- **Ana Martínez** es un invitado principal sin acompañantes

## Ventajas de este diseño

1. **Una sola tabla**: Todas las personas que asistirán están en una única tabla `Guest`
2. **Fácil consulta**: Puedes ver todas las personas con una simple consulta
3. **Relación clara**: El campo `guestId` indica quién es el invitado principal de cada acompañante
4. **Campo identificador**: El campo `isCompanion` permite filtrar rápidamente entre invitados y acompañantes
5. **Cascada**: Al eliminar un invitado principal, sus acompañantes se eliminan automáticamente
6. **Flexible**: Puedes crear invitados con o sin acompañantes usando el mismo endpoint

## Consultas útiles

### Obtener solo invitados principales:
```sql
SELECT * FROM "Guest" WHERE "isCompanion" = false;
```

### Obtener solo acompañantes:
```sql
SELECT * FROM "Guest" WHERE "isCompanion" = true;
```

### Obtener un invitado con sus acompañantes:
```sql
SELECT 
  g.*,
  c.id as companion_id,
  c.name as companion_name,
  c.confirmed as companion_confirmed
FROM "Guest" g
LEFT JOIN "Guest" c ON c."guestId" = g.id
WHERE g.id = 'uuid-del-invitado' AND g."isCompanion" = false;
```

### Contar personas confirmadas:
```sql
SELECT 
  COUNT(CASE WHEN "isCompanion" = false AND confirmed = true THEN 1 END) as confirmed_guests,
  COUNT(CASE WHEN "isCompanion" = true AND confirmed = true THEN 1 END) as confirmed_companions,
  COUNT(CASE WHEN confirmed = true THEN 1 END) as total_confirmed
FROM "Guest";
```
