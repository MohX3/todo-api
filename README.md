# Todo API

A production-ready NestJS REST API for managing Todos with TypeORM and SQLite.

## Docker Hub Repository

- **Image Link**: [hub.docker.com/r/mohx31/todo-api](https://hub.docker.com/r/mohx31/todo-api)
- **Pull Command**: `docker pull mohx31/todo-api:latest`

## Prerequisites

- **Node.js**
- **npm**
- **Docker**

## Environment Variables

| Variable     | Default         | Description                                                        |
| ------------ | --------------- | ------------------------------------------------------------------ |
| `PORT`     | `3000`        | Application listening port                                         |
| `NODE_ENV` | `development` | Application runtime environment (`development` / `production`) |

## Installation

```bash
# Clone the repository
git clone https://github.com/MohX3/todo-api.git
cd t3

# Install dependencies
npm install
```

## Running Locally

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production build & start
npm run build
npm run start:prod
```

App will be available at `http://localhost:3000`.

## Building the Docker Image

```bash
# Build production image
docker build -t mohx31/todo-api:latest .

# Run container locally
docker run -p 3000:3000 mohx31/todo-api:latest
```

## Running with Docker Compose

```bash
# Start container stack in detached mode
docker compose up -d

# Check container logs
docker compose logs -f

# Stop container stack
docker compose down
```

## API Endpoints

### Base URL: `http://localhost:3000`

| Method     | Endpoint         | Description         | Request Body Example                                                             |
| ---------- | ---------------- | ------------------- | -------------------------------------------------------------------------------- |
| `POST`   | `/todos`       | Create a new todo   | `{"title": "Buy groceries", "description": "Milk, Bread", "completed": false}` |
| `GET`    | `/todos`       | List all todos      | N/A                                                                              |
| `GET`    | `/todos/stats` | Get todo statistics | N/A                                                                              |
| `GET`    | `/todos/:id`   | Get todo by ID      | N/A                                                                              |
| `PATCH`  | `/todos/:id`   | Update todo         | `{"completed": true}`                                                          |
| `DELETE` | `/todos/:id`   | Delete todo by ID   | N/A                                                                              |

### Example Usage

```bash
# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete Step 8", "description": "Write documentation"}'

# Get all todos
curl http://localhost:3000/todos

# Get stats
curl http://localhost:3000/todos/stats
```
