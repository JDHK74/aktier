# Villabatteri CRM-system

Ett webbaserat CRM-system för hantering av leads och säljprocesser för villabatterier.

## Funktioner

### Lead-hantering
- ✅ Importera leads manuellt eller via API
- ✅ Registrera leadkälla (Facebook, leadgen-bolag, etc.)
- ✅ Lagra kontaktinfo: namn, telefon, email, adress, kommun
- ✅ Anteckningar och leadkvalitet (Hot, Warm, Cold)

### Säljare
- ✅ Tilldela leads till specifika säljare
- ✅ Översikt per säljare över aktiva leads
- ✅ Användarhantering med olika behörighetsnivåer

### Dashboard
- ✅ Dashboard med nyckeltal och statistik
- ✅ Översikt över leads uppdelat på kvalitet
- ✅ Lista över senaste leads

## Teknisk Stack

**Backend:**
- Node.js med Express
- PostgreSQL databas
- JWT autentisering
- Bcrypt för lösenordshashning

**Frontend:**
- React 18
- React Router för navigation
- Axios för API-anrop
- Responsiv design (mobil & desktop)

## Förutsättningar

Innan du börjar, se till att du har följande installerat:
- Node.js (v16 eller senare)
- PostgreSQL (v12 eller senare)
- npm eller yarn

## Installation

### 1. Klona repositoryt

```bash
git clone <repository-url>
cd aktier
```

### 2. Sätt upp databasen

Skapa en PostgreSQL-databas:

```bash
# Logga in på PostgreSQL
psql -U postgres

# Skapa databas
CREATE DATABASE villabatteri_crm;

# Avsluta psql
\q
```

### 3. Konfigurera backend

```bash
cd backend

# Installera dependencies
npm install

# Skapa .env fil
cp .env.example .env

# Redigera .env och fyll i dina databasuppgifter
```

Exempel på `.env`:
```
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=villabatteri_crm
DB_USER=postgres
DB_PASSWORD=ditt_lösenord

JWT_SECRET=din_hemliga_nyckel_här
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### 4. Kör databasmigrationer

```bash
# I backend-mappen
npm run migrate
```

Detta kommer att skapa alla nödvändiga tabeller och seed-data inklusive en admin-användare:
- **Email:** admin@villabatteri.se
- **Lösenord:** admin123

⚠️ **VIKTIGT:** Ändra lösenordet efter första inloggningen!

### 5. Konfigurera frontend

```bash
cd ../frontend

# Installera dependencies
npm install
```

### 6. Starta applikationen

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Applikationen kommer att öppnas automatiskt på `http://localhost:3000`

## API Endpoints

### Autentisering
- `POST /api/auth/login` - Logga in
- `GET /api/auth/me` - Hämta nuvarande användare
- `GET /api/auth/users` - Hämta alla användare
- `POST /api/auth/register` - Registrera ny användare (endast admin)

### Leads
- `GET /api/leads` - Hämta alla leads (med filtrering)
- `GET /api/leads/:id` - Hämta ett specifikt lead
- `POST /api/leads` - Skapa nytt lead
- `PUT /api/leads/:id` - Uppdatera lead
- `DELETE /api/leads/:id` - Ta bort lead
- `GET /api/leads/stats` - Hämta lead-statistik

### Query Parameters för filtrering (GET /api/leads)
- `search` - Sök i namn, email, telefon
- `quality` - Filtrera på kvalitet (hot, warm, cold)
- `assignedTo` - Filtrera på tilldelad säljare (user ID)
- `kommun` - Filtrera på kommun
- `sourceId` - Filtrera på leadkälla
- `limit` - Antal resultat (default: 50)
- `offset` - Offset för paginering (default: 0)

## Databasschema

### Tabeller

#### users (Säljare)
- id (UUID, Primary Key)
- email (Unique)
- password_hash
- first_name
- last_name
- role (admin, manager, salesperson)
- is_active
- created_at, updated_at

#### lead_sources (Leadkällor)
- id (UUID, Primary Key)
- name (Unique)
- type (facebook, leadgen_company, manual, other)
- description
- is_active
- created_at, updated_at

#### leads
- id (UUID, Primary Key)
- source_id (Foreign Key -> lead_sources)
- assigned_to (Foreign Key -> users)
- first_name, last_name
- email, phone
- address, postal_code, city, kommun
- quality (hot, warm, cold)
- notes
- external_id
- created_at, updated_at, last_contacted_at

#### deals (Affärer/Pipeline) - Redo för framtida implementation
- id (UUID, Primary Key)
- lead_id (Foreign Key -> leads)
- assigned_to (Foreign Key -> users)
- title, status
- estimated_value
- expected_close_date, actual_close_date
- created_at, updated_at

#### activities (Aktivitetslogg) - Redo för framtida implementation
- id (UUID, Primary Key)
- lead_id, deal_id, user_id (Foreign Keys)
- type (call, meeting, email, quote, note)
- subject, description
- activity_date
- duration_minutes

#### deal_status_history - Redo för framtida implementation
- id (UUID, Primary Key)
- deal_id (Foreign Key -> deals)
- user_id (Foreign Key -> users)
- old_status, new_status
- notes
- created_at

## Säkerhet

- JWT-baserad autentisering
- Bcrypt för lösenordshashning
- CORS-skydd
- Helmet.js för säkerhetsheaders
- Input validering med express-validator
- SQL injection-skydd via parametriserade queries

## Framtida förbättringar

Systemet är byggt med följande framtida funktioner i åtanke:

### Pipeline-hantering
- Visualisering av affärspipeline med drag-and-drop
- Stadier: Ny lead → Kontaktad → Offerterad → Vunnen/Förlorad
- Estimerat affärsvärde och förväntad stängningsdatum
- Historik över statusändringar

### Aktivitetslogg
- Registrera samtal, möten, offerter
- Tidsspårning för aktiviteter
- Koppla aktiviteter till leads och affärer

### Rapportering
- Konverteringsgrad per leadkälla
- Säljare-prestationsrapporter
- Exportfunktion för data (CSV, Excel)

### API-integrationer
- Facebook Lead Ads integration
- Webhook-support för leadgen-bolag
- Email-integration för automatiska notifikationer

### Notifikationer
- Email-notifikationer för nya leads
- Påminnelser för uppföljning
- Dagliga/veckovisa rapporter

## Utveckling

### Projektstruktur

```
aktier/
├── backend/
│   ├── src/
│   │   ├── config/          # Konfiguration (databas, JWT)
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── migrations/      # Databasmigrationer
│   │   ├── models/          # Databasmodeller
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express app
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React-komponenter
│   │   ├── pages/           # Sidor
│   │   ├── services/        # API-anrop
│   │   ├── utils/           # AuthContext, helpers
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

### Kör i produktion

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Servera build-mappen med en webbserver (nginx, Apache, etc.)
```

## Felsökning

### Databas-anslutningsproblem
- Kontrollera att PostgreSQL är igång
- Verifiera databasuppgifterna i `.env`
- Kör migrations om tabeller saknas

### CORS-fel
- Kontrollera att `CORS_ORIGIN` i backend `.env` matchar frontend URL
- Se till att frontend kör på rätt port (default: 3000)

### JWT-fel
- Kontrollera att `JWT_SECRET` är satt i `.env`
- Logga ut och in igen om token är ogiltig

## Support

För frågor eller problem, kontakta utvecklingsteamet.

## Licens

MIT
