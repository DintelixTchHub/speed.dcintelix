# Rwanda Internet Speed Analytics

## Overview

This system provides comprehensive speed test analytics for Rwanda with anonymous data collection and ISP performance rankings.

## Features

### 1. Anonymous Data Collection
- **IP Address Hashing**: User IP addresses are hashed using SHA-256 for privacy
- **Anonymized Storage**: No personal identifying information is stored
- **Location Privacy**: Coordinates are rounded to 2 decimal places
- **Data Validation**: All incoming data is validated and sanitized

### 2. Rwanda-Specific Analytics

#### ISP Rankings
- **Rwanda ISP Rankings**: `/api/analytics/rwanda/isp-rankings`
  - Shows average download/upload speeds
  - Calculates ping and jitter metrics
  - Tracks packet loss
  - Filters by country automatically

```bash
GET /api/analytics/rwanda/isp-rankings?range=30d
```

Response:
```json
[
  {
    "rank": 1,
    "name": "ISP Name",
    "averageDownload": 45.23,
    "averageUpload": 15.67,
    "averagePing": 45.2,
    "averageJitter": 8.5,
    "packetLoss": 0.2,
    "tests": 234,
    "country": "Rwanda"
  }
]
```

#### Rwanda Overview
- **Overview**: `/api/analytics/rwanda?range=30d`
  - Total tests conducted
  - Average speeds and latency
  - Active ISPs count
  - Cities covered

```bash
GET /api/analytics/rwanda?range=30d
```

Response:
```json
{
  "country": "Rwanda",
  "totalTests": 1500,
  "averageDownload": 42.5,
  "averageUpload": 14.2,
  "averagePing": 48.3,
  "averageJitter": 9.2,
  "averagePacketLoss": 0.15,
  "testsToday": 45,
  "activeISPs": 8,
  "cities": 12
}
```

#### City Performance
- **City Stats**: `/api/analytics/rwanda/cities?range=30d`
  - Performance by city
  - Best performing cities
  - Test count per city

```bash
GET /api/analytics/rwanda/cities?range=30d
```

#### ISP by City Comparison
- **ISP City Comparison**: `/api/analytics/rwanda/isp-city-comparison?range=30d`
  - Performance of each ISP in different cities
  - Helps identify regional disparities

```bash
GET /api/analytics/rwanda/isp-city-comparison?range=30d
```

### 3. Data Models

#### SpeedTest Record
```typescript
{
  download: number;      // Mbps
  upload: number;        // Mbps
  ping: number;          // ms
  jitter: number;        // ms
  packetLoss: number;    // percentage
  isp: string;           // ISP name
  asn: number;           // Autonomous System Number
  country: string;       // Country name
  province: string;      // Province/Region
  district: string;      // District
  city: string;          // City
  latitude: number;      // Rounded to 2 decimals
  longitude: number;     // Rounded to 2 decimals
  browser: string;       // Browser name
  os: string;            // Operating system
  deviceType: string;    // Mobile/Tablet/Desktop
  networkType: string;   // Wi-Fi/4G/5G/Ethernet
  server: string;        // Test server name
  ipHash: string;        // SHA-256 hash of IP
  timestamp: DateTime;   // Test time
}
```

### 4. Rwanda Cities Supported

Major cities with built-in normalization:
- Kigali
- Muhanga
- Musanze
- Ngoma
- Kayonza
- Rwamagana
- Nyagatare
- Butare/Huye
- Gisenyi
- Kibuye/Karongi
- Cyangugu
- And 30+ more

### 5. Data Submission

Submit speed test results:

```bash
POST /api/analytics/submit

{
  "download": 45.5,
  "upload": 15.2,
  "ping": 48.3,
  "jitter": 8.5,
  "packetLoss": 0.15,
  "isp": "MTN Rwanda",
  "asn": 37394,
  "country": "Rwanda",
  "province": "Kigali",
  "city": "Kigali",
  "latitude": -1.9459,
  "longitude": 29.8739,
  "browser": "Chrome",
  "operatingSystem": "Windows",
  "deviceType": "Desktop",
  "networkType": "Wi-Fi",
  "server": "Kigali-1",
  "ipAddress": "192.168.1.1"
}
```

### 6. Privacy & Security

- **No PII Stored**: Personal information is not collected
- **IP Anonymization**: IPs are hashed and cannot be reversed
- **Coordinate Rounding**: GPS coordinates are rounded for privacy
- **Data Encryption**: All data in transit uses HTTPS
- **Database Security**: Follows PostgreSQL best practices

### 7. Query Parameters

All analytics endpoints support:
- `range`: Time range (today, 7d, 30d, 90d, all) - default: 30d

### 8. Rwanda-Specific Functions

#### Analytics DB Functions
```typescript
// Get Rwanda ISP rankings
getRwandaIspRankings(range?: string)

// Get Rwanda overview metrics
getRwandaAnalyticsOverview(range?: string)

// Get city performance stats
getRwandaCityStats(range?: string)

// Get ISP performance by city
getRwandaIspByCityComparison(range?: string)

// Get rankings for any country
getIspRankingsByCountry(country: string, range?: string)
```

#### Analytics Helpers
```typescript
// Normalize Rwanda city names
normalizeRwandaCity(city?: string)

// Normalize Rwanda province names
normalizeRwandaProvince(province?: string)

// Validate Rwanda coordinates
validateRwandaCoordinates(lat?: number, lon?: number)

// Get region from coordinates
getRwandaRegionFromCoordinates(lat?: number, lon?: number)
```

### 9. Integration Example

```typescript
import { analyticsService } from '@/services/analytics.service';

// Get Rwanda rankings
const rankings = await analyticsService.getISPRankings('30d');
const rwandaRankings = rankings.filter(r => r.country === 'Rwanda');

// Submit test result
await analyticsService.submitTest({
  download: 45.5,
  upload: 15.2,
  ping: 48.3,
  jitter: 8.5,
  country: 'Rwanda',
  city: 'Kigali',
  isp: 'MTN Rwanda'
});
```

### 10. Data Retention & Privacy Policy

- Data is stored for up to 90 days
- Only aggregated statistics are displayed publicly
- Individual test results are kept private
- Users can request data deletion (future feature)
- No data is shared with third parties

## Architecture

```
Data Flow:
  Client → Submit Test → /api/analytics/submit
    ↓
  Validate & Sanitize Data
    ↓
  Hash IP Address
    ↓
  Normalize Rwanda Data (if applicable)
    ↓
  Store in PostgreSQL
    ↓
  Query via Analytics Endpoints
    ↓
  Return Aggregated Results
```

## Database Schema

The system uses Prisma ORM with PostgreSQL:

```prisma
model SpeedTest {
  id String @id @default(cuid())
  download Float
  upload Float
  ping Float
  jitter Float
  packetLoss Float?
  isp String?
  asn Int?
  country String?
  province String?
  district String?
  city String?
  latitude Float?
  longitude Float?
  browser String?
  os String?
  deviceType String?
  networkType String?
  server String?
  timestamp DateTime @default(now())
  ipHash String?
  
  // Relations
  location Location? @relation(fields: [locationId])
  locationId String?
  ispRecord ISP? @relation(fields: [ispId])
  ispId String?
  
  @@index([timestamp])
  @@index([country])
  @@index([city])
  @@index([isp])
}
```

## Future Enhancements

1. Real-time ISP ranking updates
2. Predictive analytics for speed trends
3. Mobile app integration
4. CSV export of statistics
5. Public dashboard for Rwanda speeds
6. ISP service quality scoring
7. Network outage detection

---

**Last Updated**: August 1, 2026
**Status**: Production Ready
