# Development Guide

## Setting Up Development Environment

### Prerequisites
- Node.js 18+ (download from nodejs.org)
- PostgreSQL 12+ (or use Docker)
- Git
- VS Code (recommended)

### Environment Setup

1. **Clone/Setup Repository**
```bash
cd "SK AGROVET WEB BASED SYSTEM"
```

2. **Backend Setup**
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

### Docker Setup (Optional)
```bash
# Build images
docker-compose build

# Start containers
docker-compose up

# Run migrations in container
docker-compose exec backend npm run db:migrate
```

## Project Structure

```
SK AGROVET WEB BASED SYSTEM/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── store/               # Redux state
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   ├── types/               # TypeScript types
│   │   ├── styles/              # CSS files
│   │   ├── assets/              # Images, icons
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind config
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Dependencies
│
├── backend/
│   ├── src/
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Data access
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Middleware
│   │   ├── config/              # Configuration
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Entry point
│   ├── database/
│   │   ├── migrations/          # SQL migrations
│   │   └── seeds/               # Seed data
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Dependencies
│
├── database/                    # Database backups/scripts
├── docs/                        # Documentation
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # Project readme
```

## Coding Standards

### TypeScript
- Use strict mode (enabled in tsconfig.json)
- Define interfaces for all props and state
- Use enums for string constants
- Avoid `any` type, use `unknown` if necessary

### React
- Functional components with hooks
- Use React.memo for optimization
- Extract reusable components
- Co-locate styles with components
- Use custom hooks for logic reuse

### Express
- Separate routes, controllers, services
- Use middleware for cross-cutting concerns
- Validate all inputs with Joi
- Return consistent response format
- Log significant events

### Naming Conventions
```
Files:        camelCase.ts or PascalCase.tsx
Components:   PascalCase (MyComponent)
Functions:    camelCase (handleClick)
Interfaces:   PascalCase with I prefix (IUser)
Constants:    UPPER_SNAKE_CASE (MAX_FILE_SIZE)
Database:     snake_case (user_profiles)
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Hotfix: `hotfix/description`
- Release: `release/version`

### Commit Format
```
[TYPE] Short description

Longer explanation if needed.

- Detail 1
- Detail 2

Fixes #123
```

Types: feat, fix, style, refactor, test, docs, chore

### Pull Request
1. Create feature branch
2. Make changes
3. Commit with clear messages
4. Push to origin
5. Create PR with description
6. Code review
7. Merge to main

## Testing

### Frontend Testing
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Backend Testing
```bash
# Run tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

### Integration Testing
```bash
# Run full integration tests
npm run test:integration
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/ folder
```

### Backend Build
```bash
cd backend
npm run build
# Output: dist/ folder
npm start
```

### Docker Build
```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

## Database Migrations

### Creating New Migration
1. Create file: `database/migrations/XXX_description.ts`
2. Write migration script with SQL
3. Test locally: `npm run db:migrate`
4. Commit with migration file

### Seed Data
```bash
cd backend
npm run db:seed
```

## Debugging

### Frontend
- Chrome DevTools (F12)
- Redux DevTools extension
- React Developer Tools extension
- Console logging

### Backend
- VS Code Debugger
- Winston logs in `logs/` folder
- Database query logging
- Postman/Insomnia for API testing

## Dependencies Management

### Adding Package
```bash
# Frontend
cd frontend
npm install package-name

# Backend
cd backend
npm install package-name
```

### Updating Packages
```bash
npm update
npm audit fix
```

### Removing Package
```bash
npm uninstall package-name
```

## Performance Optimization

### Frontend
- Lazy load routes with React.lazy()
- Memoize expensive components
- Use Redux selectors for derived state
- Optimize images
- Enable gzip compression

### Backend
- Add database indices
- Use connection pooling
- Implement caching (Redis)
- Optimize queries with EXPLAIN
- Use pagination for large datasets

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process
lsof -i :3000
# Kill process
kill -9 PID
```

### Database Connection Error
- Verify PostgreSQL running
- Check credentials in .env
- Verify database exists
- Check network connection

### Module Not Found
- Run `npm install`
- Check path aliases in tsconfig
- Clear node_modules: `rm -rf node_modules && npm install`

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## Useful Commands

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview build
- `npm run lint` - Run linter
- `npm run type-check` - Check TypeScript

### Backend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter
- `npm run db:migrate` - Run migrations
- `npm run type-check` - Check TypeScript

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Tests passing
- [ ] Build successful
- [ ] No console errors
- [ ] API endpoints verified
- [ ] HTTPS configured
- [ ] Database backups
- [ ] Monitor logs
- [ ] Performance check

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
