# Frontend Directory

React-based frontend for SK AGROVET Management System.

## Project Setup

```bash
npm install
npm run dev
```

## Architecture

- **Components**: Reusable UI components organized by feature
- **Pages**: Full page components for each module
- **Store**: Redux Toolkit for state management
- **Utils**: API client and helper functions
- **Types**: TypeScript interfaces and types
- **Styles**: Tailwind CSS configuration

## Directory Structure

```
src/
├── components/
│   ├── layout/          # Navigation, header, footer
│   ├── common/          # Shared components (buttons, modals, etc)
│   ├── dashboard/       # Dashboard widgets
│   ├── inventory/       # Inventory components
│   ├── pos/             # POS interface
│   ├── ai-services/     # AI service components
│   └── veterinary/      # Veterinary module components
├── pages/               # Page level components
├── store/               # Redux store and slices
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript types
├── styles/              # Global styles
└── assets/              # Images, icons, etc
```

## Color Theme

- Primary Green: #2D5A27
- Secondary Gold: #D4AF37
- Clinical Blue: #0066CC
- Neutral Grays
