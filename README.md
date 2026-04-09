# Army Vehicle Dispatch — MVP

> AI-assisted military convoy route optimization and fleet dispatch platform built for mission-critical logistics operations.

---

## Table of Contents

- [Army Vehicle Dispatch — MVP](#army-vehicle-dispatch--mvp)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Problem Statement](#problem-statement)
    - [What This System Does](#what-this-system-does)
  - [System Architecture](#system-architecture)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Component Architecture](#component-architecture)
    - [Component Hierarchy](#component-hierarchy)
    - [Component Responsibilities](#component-responsibilities)
    - [Inter-Component Communication](#inter-component-communication)
  - [Application Flow](#application-flow)
  - [Data Models](#data-models)
    - [Vehicle](#vehicle)
    - [Vehicle Speed Profiles (km/h)](#vehicle-speed-profiles-kmh)
    - [Fuel Consumption Factors (relative units / km)](#fuel-consumption-factors-relative-units--km)
    - [Route (from Mapbox Directions API)](#route-from-mapbox-directions-api)
    - [Computed Route (client-side enrichment)](#computed-route-client-side-enrichment)
    - [Convoy Track](#convoy-track)
  - [External Integrations](#external-integrations)
    - [Mapbox APIs](#mapbox-apis)
  - [Configuration \& Environment](#configuration--environment)
    - [Environment Variables](#environment-variables)
    - [Map Defaults](#map-defaults)
    - [NPM Scripts](#npm-scripts)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Production Build](#production-build)
  - [Architectural Patterns](#architectural-patterns)

---

## Overview

**Army Vehicle Dispatch MVP** is a React-based single-page application (SPA) that enables military logistics operators to plan convoy routes, manage fleet inventory, and generate optimized dispatch plans in real time. The system integrates Mapbox for geospatial visualization and computes alternative routes with fuel consumption and ETA estimates for different vehicle classes.

### Problem Statement

Traditional military logistics relies on manual coordination, paper-based routing, and fragmented vehicle tracking — causing delayed dispatch, inefficient fuel planning, and poor asset utilization during time-sensitive missions.

### What This System Does

- Resolves origin/destination names to geographic coordinates via geocoding
- Fetches up to 4 alternative convoy routes from the Mapbox Directions API
- Calculates fuel consumption and ETA per route based on vehicle class
- Displays interactive route comparison on a live Mapbox map
- Tracks convoy status (On Time / Delayed) for active transports
- Provides fleet inventory view across vehicle categories with availability status

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (SPA)                           │
│                                                                 │
│  ┌──────────────┐    ┌───────────────────────────────────────┐  │
│  │ SplashScreen │───▶│             Dashboard                 │  │
│  │   (/ route)  │    │         (/Dashboard route)            │  │
│  └──────────────┘    │                                       │  │
│                      │  ┌─────────────┐  ┌────────────────┐ │  │
│                      │  │RoutePlanner │  │  VehiclePanel  │ │  │
│                      │  │  (Map view) │  │ (Fleet sidebar)│ │  │
│                      │  └──────┬──────┘  └────────────────┘ │  │
│                      │         │                             │  │
│                      │  ┌──────▼──────┐  ┌────────────────┐ │  │
│                      │  │ ActionPopup │  │ConfirmationBox │ │  │
│                      │  │ (Progress)  │  │  (Verify UI)   │ │  │
│                      │  └─────────────┘  └────────────────┘ │  │
│                      └───────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
   │  Mapbox GL JS   │  │ Mapbox Geocoding│  │ Mapbox Directions│
   │  (Map render)   │  │      API        │  │      API         │
   │                 │  │ (Coords lookup) │  │ (Route options)  │
   └─────────────────┘  └─────────────────┘  └──────────────────┘
```

**Architecture Type:** Frontend-only SPA (no backend, no database)
All route computation, fuel estimation, and ETA calculation run entirely in the browser. External calls are limited to Mapbox APIs.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | 19.1.0 | Component-based rendering |
| Routing | React Router DOM | 7.6.0 | Client-side page navigation |
| Mapping | Mapbox GL JS | 3.12.0 | Interactive map, route rendering |
| Geocoding | Mapbox Geocoding API | — | Location name → coordinates |
| Directions | Mapbox Directions API | — | Alternative route computation |
| UI Components | Radix UI (Tabs) | 1.1.12 | Accessible tab primitives |
| Icons | Lucide React | 0.511.0 | SVG icon library |
| CSS Framework | Tailwind CSS | 4.1.7 | Utility-first styling |
| CSS Processing | PostCSS + Autoprefixer | 8.5.3 / 10.4.21 | Vendor prefixing |
| Tooling | Create React App (react-scripts) | 5.0.1 | Build system and dev server |
| Testing | React Testing Library | 16.3.0 | Component unit testing |
| Performance | Web Vitals | 2.1.4 | Core web metrics |

---

## Project Structure

```
Army-vehicle-dispatch-mvp-main/
│
├── public/                        # Static assets served at root
│   ├── index.html                 # HTML shell — React mounts here
│   ├── favicon.ico
│   ├── manifest.json              # PWA manifest
│   ├── robots.txt
│   └── images/                   # Vehicle imagery (a.png – g.png)
│
├── src/
│   ├── index.js                   # React DOM render entry point
│   ├── App.js                     # Root component — router config
│   ├── App.css
│   ├── index.css
│   │
│   ├── assets/                    # UI icons and imagery
│   │   ├── alert.png              # Warning/alert icon
│   │   ├── bag.png                # Cargo icon
│   │   ├── commodities.png        # Commodities icon
│   │   ├── equipment.png          # Equipment icon
│   │   ├── personnel.png          # Personnel icon
│   │   ├── tick.png               # Confirmation tick
│   │   └── triangle.png           # Warning triangle
│   │
│   └── components/                # Reusable UI components
│       ├── SplashScreen.jsx       # Animated intro screen
│       ├── SplashScreen.css
│       ├── Dashboard.jsx          # Main layout — route input, cargo, status
│       ├── Dashboard.css
│       ├── RoutePlanner.jsx       # Mapbox map + route logic
│       ├── planner.css
│       ├── VehiclePanel.jsx       # Fleet inventory display
│       ├── VehiclePanel.css
│       ├── ActionPopup.jsx        # Dispatch progress overlay
│       ├── ActionPopup.css
│       └── ConfirmationBox.jsx    # Convoy verification widget
├── build/                         # Production build artifacts
├── .env                           # Environment variables (Mapbox token)
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Component Architecture

### Component Hierarchy

```
App
├── SplashScreen          (route: /)
└── Dashboard             (route: /Dashboard)
    ├── RoutePlanner      (embedded — map and route logic)
    ├── VehiclePanel      (embedded — fleet sidebar)
    ├── ActionPopup       (modal overlay — dispatch progress)
    └── ConfirmationBox   (floating widget — convoy confirmation)
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| **App** | Defines routes (`/` and `/Dashboard`) using React Router |
| **SplashScreen** | 8-second animated intro with rotating status messages and a Mapbox background; auto-redirects to Dashboard |
| **Dashboard** | Application shell — holds route input form, cargo status cards, convoy tracker, and wires RoutePlanner via ref |
| **RoutePlanner** | Owns Mapbox GL instance; geocodes locations; fetches and renders 4 alternative routes; calculates fuel/ETA per vehicle type; exposes `planRoute()` via `useImperativeHandle` |
| **VehiclePanel** | Reads static fleet inventory; renders vehicle cards with category tabs, capacity, hours, and maintenance warnings |
| **ActionPopup** | Animated progress modal shown during route generation; fires the actual `planRoute()` call on `plannerRef` |
| **ConfirmationBox** | Floating confirmation UI for verifying convoy dispatch |

### Inter-Component Communication

```
Dashboard
  ├── plannerRef (React ref) ──────────────▶ RoutePlanner.planRoute()
  ├── origin / destination (state props) ──▶ ActionPopup
  └── ActionPopup.onComplete ──────────────▶ hides popup, shows map

RoutePlanner ──(CustomEvent: "routeSelected")──▶ Dashboard listener
```

**Patterns used:**
- `useRef` + `useImperativeHandle` for parent-to-child imperative calls
- `CustomEvent` browser API for child-to-parent route selection signal
- `useState` / `useEffect` for all local state management
- No global state (no Redux, no Context API)

---

## Application Flow

```
1. User opens app
        │
        ▼
2. SplashScreen renders
   - Mapbox map loads centered on Bengaluru
   - Rotating status messages animate for 8 seconds
        │
        ▼
3. Auto-navigate to /Dashboard
   - Mapbox map re-initializes centered on New Delhi
   - Route input form appears in left sidebar
   - Convoy tracker and cargo status widgets load
        │
        ▼
4. User enters Origin + Destination → clicks "Generate Plan"
        │
        ▼
5. ActionPopup opens (progress overlay)
   - Calls plannerRef.current.planRoute(origin, destination)
        │
        ▼
6. RoutePlanner executes async pipeline:
   a. Geocode origin   → Mapbox Geocoding API → [lng, lat]
   b. Geocode destination → Mapbox Geocoding API → [lng, lat]
   c. Fetch directions  → Mapbox Directions API → 4 routes
   d. Place markers on map (origin + destination pins)
   e. Compute per-route:
      - Distance (km)
      - Duration (minutes, adjusted by vehicle speed profile)
      - Fuel (distance × vehicle consumption factor)
   f. Render route lines on map
        │
        ▼
7. Route comparison panel displays 4 options with fuel/ETA
        │
        ▼
8. User selects a route → fires "routeSelected" CustomEvent
   - Selected route highlighted on map
   - Comparison panel hides
```

---

## Data Models

### Vehicle

```js
{
  type: string,           // Display name, e.g. "Tatra T815"
  id: string,             // Unit ID, e.g. "LTR-TRS-58"
  hours: number,          // Available operating hours
  capacity: string,       // Payload, e.g. "25000Kg"
  availability: string,   // Status message
  warning: boolean,       // True if maintenance alert active
  imageUrl: string        // Path to vehicle image asset
}
```

### Vehicle Speed Profiles (km/h)

```js
{
  'military-jeep':      60,
  'transport-tank':     50,
  'battle-tank':        40,
  'artillery-vehicle':  35,
  'apc':                55
}
```

### Fuel Consumption Factors (relative units / km)

```js
{
  'military-jeep':      0.6,
  'transport-tank':     0.8,
  'battle-tank':        1.2,
  'artillery-vehicle':  1.5,
  'apc':                1.0
}
```

### Route (from Mapbox Directions API)

```js
{
  distance: number,     // Total distance in meters
  duration: number,     // Base duration in seconds
  geometry: {
    type: 'LineString',
    coordinates: [[lng, lat], ...]  // GeoJSON path
  }
}
```

### Computed Route (client-side enrichment)

```js
{
  ...mapboxRoute,
  distanceKm: number,       // distance / 1000
  durationMin: number,      // adjusted by vehicle speed profile
  fuelEstimate: number      // distanceKm × consumption factor
}
```

### Convoy Track

```js
{
  id: string,                        // e.g. "TL-15B-756"
  status: 'On Time' | 'Delayed',
  route: string                      // Human-readable route description
}
```

---

## External Integrations

### Mapbox APIs

| API | Endpoint | Usage |
|---|---|---|
| **Mapbox GL JS** | CDN bundle | Interactive map rendering, layer/source management, marker placement |
| **Geocoding v5** | `api.mapbox.com/geocoding/v5/mapbox.places/{query}.json` | Resolves location name strings to `[lng, lat]` coordinates |
| **Directions v5** | `api.mapbox.com/directions/v5/mapbox/driving/{coords}` | Returns up to 4 alternative driving routes as GeoJSON |

**Directions API parameters used:**
```
alternatives=true
geometries=geojson
overview=full
access_token={REACT_APP_MAPBOX_ACCESS_TOKEN}
```

**Authentication:** Bearer token via `REACT_APP_MAPBOX_ACCESS_TOKEN` environment variable.

---

## Configuration & Environment

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
```

All `REACT_APP_` prefixed variables are inlined into the browser bundle at build time by Create React App.

### Map Defaults

| Screen | Center Coordinates | Zoom |
|---|---|---|
| SplashScreen | `[77.5946, 12.9716]` (Bengaluru) | 12 |
| Dashboard | `[77.209, 28.6139]` (New Delhi) | 4 |

### NPM Scripts

```bash
npm start        # Start dev server at http://localhost:3000
npm run build    # Production build → ./build/
npm test         # Run test suite (React Testing Library)
npm run eject    # Eject from Create React App (irreversible)
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- NPM ≥ 9
- A Mapbox account with a public access token

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd Army-vehicle-dispatch-mvp-main

# 2. Install dependencies
npm install

# 3. Configure environment
echo "REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here" > .env

# 4. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
# Serve the ./build/ directory with any static file host
# (Vercel, Netlify, AWS S3 + CloudFront, nginx, etc.)
```

---

## Architectural Patterns

| Pattern | Where Applied | Purpose |
|---|---|---|
| **Component-Based UI** | All `.jsx` files | Encapsulate UI into isolated, reusable units |
| **Ref Forwarding + `useImperativeHandle`** | Dashboard → RoutePlanner | Parent triggers child method (`planRoute`) imperatively |
| **Browser CustomEvent** | RoutePlanner → Dashboard | Loosely coupled child-to-parent route selection signal |
| **Controlled State** | Dashboard form inputs | Origin/destination strings driven by `useState` |
| **Side-Effect Hooks** | Map initialization, API calls | `useEffect` manages Mapbox lifecycle and async fetches |
| **CSS Module Isolation** | Each component has a `.css` file | Prevent style leakage between components |
| **Static Data as Constants** | Vehicle inventory, speed/fuel tables | Avoids unnecessary external API dependencies in MVP |

---
