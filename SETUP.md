# Snabbstart Guide

## Steg 1: Installera alla dependencies

```bash
# I root-mappen
npm run install:all
```

Detta kör:
- `npm install` i backend-mappen
- `npm install` i frontend-mappen

## Steg 2: Sätt upp PostgreSQL-databasen

```bash
# Skapa databasen
psql -U postgres -c "CREATE DATABASE villabatteri_crm;"
```

## Steg 3: Konfigurera backend

```bash
# Kopiera och redigera .env
cd backend
cp .env.example .env
# Redigera .env med dina databasuppgifter
```

## Steg 4: Kör migrationer

```bash
# I backend-mappen
npm run migrate
```

## Steg 5: Starta systemet

Öppna två terminaler:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## Steg 6: Logga in

Öppna http://localhost:3000 i din webbläsare och logga in med:
- **Email:** admin@villabatteri.se
- **Lösenord:** admin123

## Färdigt!

Du kan nu börja använda systemet. Prova att:
1. Skapa ett nytt lead
2. Tilldela det till dig själv
3. Redigera leadet och ändra kvalitet
4. Se statistiken på dashboard

## Felsökning

Om något inte fungerar:

1. **Backend startar inte:**
   - Kontrollera att PostgreSQL är igång
   - Verifiera .env-filen
   - Kör migrations igen

2. **Frontend kan inte ansluta till backend:**
   - Se till att backend kör på port 3001
   - Kontrollera CORS-inställningar i backend .env

3. **Kan inte logga in:**
   - Kör migrations igen för att skapa admin-användaren
   - Kontrollera att JWT_SECRET är satt i .env

## Nästa steg

- Ändra admin-lösenordet
- Lägg till fler användare (kräver admin-behörighet)
- Börja importera leads
- Utforska API-endpoints för integrationer
