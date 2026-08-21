# FoodLoop

FoodLoop is an AI-assisted food rescue platform that connects food providers with community organizations to reduce food waste.

## Features

- User registration and login
- JWT authentication and role-based access
- Food listing and management
- Food claiming
- Dashboard and rescue statistics
- Gemini-powered AI Advisor
- Deterministic Python matching service
- MongoDB database
- Docker containerization
- Kubernetes deployment

## Architecture

React Frontend
        |
        v
API Gateway
        |
   +----+----+----+
   |    |    |    |
 Auth Core  AI  Python
   |    |    |    |
   +----+----+    |
        |         |
      MongoDB   Gemini

## Technology Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- AI: Google Gemini API
- Matching: Python + FastAPI
- Authentication: JWT + bcrypt
- Containers: Docker
- Orchestration: Kubernetes
- Version Control: Git + GitHub

## Services

| Service | Port |
|---|---:|
| Frontend | 3000 |
| API Gateway | 8080 |
| Auth Service | 3001 |
| Core Service | 3002 |
| AI Service | 3003 |
| Python Service | 8000 |
| MongoDB | 27017 |

## AI Advisor

FoodLoop includes a Gemini-powered AI Advisor.

The frontend communicates with the backend instead of exposing Gemini API keys directly.

Gemini credentials remain server-side.

## Reliability

The system uses separate services for authentication, core application logic, AI, and deterministic matching.

The Python matching service provides functionality that does not depend completely on Gemini availability.

## Docker

Run the complete application with:

docker compose up --build

Frontend:

http://localhost:3000

## Kubernetes

Kubernetes manifests are available in:

kubernetes/

Check the deployment with:

kubectl get pods -n foodloop

## Project Structure

frontend/
backend/
ai-service/
python-service/
kubernetes/
terraform/
rag/
docker-compose.yml

## Hackathon

FoodLoop was developed as a hackathon project demonstrating full-stack development, AI integration, microservices, Docker, Kubernetes, authentication, database integration, and reliability-oriented architecture.

## GitHub

https://github.com/nimrahnaeem192/FoodLoop
