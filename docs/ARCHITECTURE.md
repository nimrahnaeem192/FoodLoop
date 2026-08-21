# Architecture

FoodLoop is a food-rescue platform connecting food providers with community organizations.

```
React Frontend
      |
      v
API Gateway
      |
      +--> Auth Service
      |
      +--> Core Service
      |
      +--> AI Service
                 |
                 +--> Python Matching Service
                 |
                 +--> Gemini
      |
      v
MongoDB
```

See the root `README.md` for service responsibilities, API paths, collections, and Gemini key handling.

Implementation of business logic has not started.
