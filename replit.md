# Hooky Letters Game

## Overview

Hooky Letters is a multiplayer word game built with React, TypeScript, Express, and WebSockets. Players compete in rounds by submitting 5-letter words containing letters from their hand, giving clues to other players, and attempting to deduce which letters are the hidden "hooky" letters and what letters other players have in their hands.

The game features real-time multiplayer functionality through WebSocket connections, a comprehensive scoring system, and a multi-phase gameplay structure including pre-round submissions, word/feedback rounds, and final deduction phases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js for HTTP API endpoints
- **Real-time Communication**: WebSocket Server (ws library) for live game updates
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage Pattern**: In-memory storage with interface abstraction for future database integration

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but not actively used - currently using in-memory storage)
- **Connection**: Neon Database serverless driver for cloud PostgreSQL
- **Migrations**: Drizzle Kit for schema management and migrations

### Game Logic Architecture
- **Game State Management**: Centralized game state with immutable updates
- **Phase Management**: State machine pattern for game phases (waiting, pre-round, word-feedback, guessing, hand-deduction, finished)
- **Turn Management**: Round-robin player turns with automatic progression
- **Scoring System**: Multi-component scoring (hooky guesses, hand deduction) with configurable point values
- **Letter Distribution**: Algorithmic distribution of alphabet letters with 3 hidden "hooky" letters

### WebSocket Communication
- **Connection Management**: Per-client connection tracking with game/player association
- **Message Broadcasting**: Room-based message distribution to game participants
- **Event Types**: Structured message types for game updates, player actions, and system notifications
- **Reconnection Handling**: Client-side reconnection logic with 3-second retry intervals

### Authentication & Session Management
- **Session Storage**: Browser localStorage for player/game identification
- **Connection Persistence**: WebSocket connection tied to player sessions
- **Room Codes**: 6-character alphanumeric codes for game joining

## External Dependencies

### UI/UX Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives (accordion, dialog, select, etc.)
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe variant API for component styling
- **cmdk**: Command palette component for enhanced UX

### Development & Build Tools
- **vite**: Modern build tool with HMR and optimized bundling
- **@replit/vite-plugin-***: Replit-specific plugins for development environment integration
- **tsx**: TypeScript execution engine for Node.js development

### Data & Validation
- **zod**: Runtime type validation and schema definition
- **drizzle-orm**: Type-safe SQL ORM with excellent TypeScript integration
- **drizzle-zod**: Bridge between Drizzle schemas and Zod validation

### Real-time Communication
- **ws**: WebSocket server implementation for Node.js
- **@tanstack/react-query**: Server state management with caching and synchronization

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx** & **tailwind-merge**: Conditional CSS class name utilities
- **nanoid**: Unique ID generation for sessions and connections