# DNS Route Analyzer

This project is a tool to analyze DNS and trace routes using a microservices architecture. It allows users to perform DNS lookups (`dig`) and `traceroute` on domains, analyzes the results, and stores historical data.

## Project Architecture (Docker Compose)

The application is entirely orchestrated using **Docker Compose**, which runs three interconnected services. The entire environment can be spun up using the provided `docker-compose.yml` file.

### Services

1. **`frontend` (Port 3000)**
   - The web user interface for inputting domains and viewing results.
   - Depends on the `backend` service being available.
   - Image: `nightcodex/dns-route-analyzer:frontend`

2. **`backend` (Port 5000)**
   - The core Node.js/Express API server. It executes system commands (`dig`, `traceroute`), handles SQLite database operations, and communicates with the AI agent.
   - Depends on the `ai-agent` service.
   - Image: `nightcodex/dns-route-analyzer:backend`

3. **`ai-agent` (Port 5001)**
   - A dedicated Node.js microservice that analyzes the output of the DNS queries and route tracing to identify high latency or extended hops.
   - Image: `nightcodex/dns-route-analyzer:ai-agent`

### Running the Application

To start the application, simply run:

```bash
docker-compose up
```

To check and stop swarm containers:
```bash
docker ps
docker update --restart=no <container_name_or_id>
docker service ls 
docker service rm <service_id>
```
To stop the application:

```bash
docker-compose down
```

This will automatically pull/build the necessary images and start all three services with their dependencies in the correct order.
