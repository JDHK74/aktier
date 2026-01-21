#!/bin/bash

echo "=== SYSTEMATISK FELSÖKNING AV VILLABATTERI CRM ==="
echo ""

# Steg 1: Stoppa allt
echo "Steg 1: Stoppar containers..."
docker-compose down

# Steg 2: Rensa Docker cache
echo "Steg 2: Rensar Docker build cache..."
docker system prune -af --volumes

# Steg 3: Rebuilda utan cache
echo "Steg 3: Rebuildar frontend från scratch..."
docker-compose build --no-cache frontend

# Steg 4: Starta services
echo "Steg 4: Startar services..."
docker-compose up -d

# Steg 5: Vänta på att services startar
echo "Steg 5: Väntar på att services startar (30 sekunder)..."
sleep 30

# Steg 6: Verifiera att api.js är korrekt i containern
echo "Steg 6: Verifierar api.js i containern..."
docker-compose exec frontend cat /app/client/src/services/api.js > /tmp/container_api.js
echo "api.js från container sparad i /tmp/container_api.js"

# Steg 7: Jämför med source
echo "Steg 7: Jämför med source..."
diff client/src/services/api.js /tmp/container_api.js

# Steg 8: Kolla att token skickas
echo "Steg 8: Testar API med token..."
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@villabatteri.se","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Testa kategorier
echo "Testar /api/categories..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/categories | python3 -m json.tool

# Testa leadkällor
echo "Testar /api/lead-sources..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/lead-sources | python3 -m json.tool

echo ""
echo "=== FELSÖKNING KLAR ==="
echo "Öppna http://localhost:3000 och testa '+ Ny lead' igen"
