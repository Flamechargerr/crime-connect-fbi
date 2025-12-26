# FBI CrimeConnect API Documentation

## Overview
The FBI CrimeConnect API provides endpoints for managing criminal intelligence data, cases, and investigations. All endpoints are prefixed with `/api`.

## Base URL
```
http://localhost:8002/api
```

## Health Check

### GET `/health`
Returns the health status of the API server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-01T14:38:25.543474+00:00"
}
```

## Core Endpoints

### GET `/`
Returns a welcome message.

**Response:**
```json
{
  "message": "Hello World"
}
```

## Status Checks

### GET `/status`
Returns all status checks.

**Response:**
```json
[
  {
    "id": "uuid",
    "client_name": "string",
    "timestamp": "2025-11-01T14:18:13.123000+00:00"
  }
]
```

### POST `/status`
Creates a new status check.

**Request Body:**
```json
{
  "client_name": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "client_name": "string",
  "timestamp": "2025-11-01T14:18:13.123000+00:00"
}
```

## Intelligence Events

### GET `/intel`
Returns all intelligence events, sorted by creation date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "severity": "string",
    "tags": ["string"],
    "created_at": "2025-11-01T14:18:13.123000+00:00"
  }
]
```

### POST `/intel`
Creates a new intelligence event.

**Request Body:**
```json
{
  "title": "string",
  "severity": "string",
  "tags": ["string"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "severity": "string",
  "tags": ["string"],
  "created_at": "2025-11-01T14:18:13.123000+00:00"
}
```

## Cases

### GET `/cases`
Returns all cases, sorted by update date (newest first). Optional query parameter `status` to filter by case status.

**Query Parameters:**
- `status` (optional): Filter by status (e.g., "active", "backlog", "archived")

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "status": "string",
    "priority": "string",
    "owner": "string",
    "notes": 0,
    "updated_at": "2025-11-01T14:18:13.123000+00:00"
  }
]
```

### POST `/cases`
Creates a new case.

**Request Body:**
```json
{
  "title": "string",
  "status": "string",
  "priority": "string",
  "owner": "string",
  "notes": 0
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "status": "string",
  "priority": "string",
  "owner": "string",
  "notes": 0,
  "updated_at": "2025-11-01T14:18:13.123000+00:00"
}
```

### PATCH `/cases/{case_id}`
Updates an existing case.

**Path Parameters:**
- `case_id`: The ID of the case to update

**Request Body:**
```json
{
  "title": "string",
  "status": "string",
  "priority": "string",
  "owner": "string",
  "notes": 0
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "status": "string",
  "priority": "string",
  "owner": "string",
  "notes": 0,
  "updated_at": "2025-11-01T14:18:13.123000+00:00"
}
```

## Timeline

### GET `/timeline`
Returns all timeline events, sorted by creation date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "string",
    "text": "string",
    "created_at": "2025-11-01T14:18:13.123000+00:00"
  }
]
```

### POST `/timeline`
Creates a new timeline event.

**Request Body:**
```json
{
  "type": "string",
  "text": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "type": "string",
  "text": "string",
  "created_at": "2025-11-01T14:18:13.123000+00:00"
}
```

## Command Center

### GET `/command`
Returns all command center transmissions, sorted by creation date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "codename": "string",
    "agent": "string",
    "channel": "string",
    "message": "string",
    "created_at": "2025-11-01T14:18:13.123000+00:00"
  }
]
```

### POST `/command`
Creates a new command center transmission.

**Request Body:**
```json
{
  "codename": "string",
  "agent": "string",
  "channel": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "codename": "string",
  "agent": "string",
  "channel": "string",
  "message": "string",
  "created_at": "2025-11-01T14:18:13.123000+00:00"
}
```

## Metrics

### GET `/metrics`
Returns computed system metrics.

**Response:**
```json
{
  "open_cases": 0,
  "active_ops": 0,
  "alerts_today": 0,
  "resolution_rate": 0
}
```

## Error Responses

All endpoints may return the following error responses:

### 404 Not Found
```json
{
  "detail": "Not Found"
}
```

### 503 Service Unavailable
Returned when the database is not configured properly.

```json
{
  "detail": "Database not configured. Ensure MONGO_URL is set in backend/.env"
}
```

### 400 Bad Request
Returned when invalid data is provided.

```json
{
  "detail": "No fields to update"
}
```

### 404 Not Found (Specific)
Returned when a specific resource is not found.

```json
{
  "detail": "Case not found"
}
```