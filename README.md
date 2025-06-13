# React FSD Full-Stack Application

A modern full-stack web application built with React, TypeScript, and Feature-Sliced Design (FSD) architecture.

## 🚀 Features

- **Frontend**: React 19 with Feature-Sliced Design
- **Backend**: Node.js with Express/Fastify
- **Type Safety**: Full TypeScript implementation
- **Monorepo**: PNPM workspace management
- **UI Library**: Shadcn/ui with Tailwind CSS 4
- **State Management**: TanStack Query & Router
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with coverage
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js >= 20.0.0
- PNPM >= 8.0.0
- Docker & Docker Compose (optional)

## 🛠️ Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/react-fsd-fullstack.git
   cd react-fsd-fullstack
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env.local
   \`\`\`

4. Initialize frontend tools:
   \`\`\`bash
   cd frontend
   npx shadcn-ui@latest init
   npx msw init public/ --save
   cd ..
   \`\`\`

## 🚀 Development

Start both frontend and backend in development mode:
\`\`\`bash
pnpm dev
\`\`\`

Or run them separately:
\`\`\`bash
pnpm dev:frontend # Frontend on http://localhost:3000
pnpm dev:backend # Backend on http://localhost:3001
\`\`\`

### Using Docker

\`\`\`bash
pnpm docker:dev
\`\`\`

## 📦 Building

Build all packages:
\`\`\`bash
pnpm build
\`\`\`

Build specific package:
\`\`\`bash
pnpm build:frontend
pnpm build:backend
\`\`\`

## 🧪 Testing

Run tests for all packages:
\`\`\`bash
pnpm test
\`\`\`

Run tests with UI:
\`\`\`bash
pnpm test:ui
\`\`\`

Generate coverage report:
\`\`\`bash
pnpm test:coverage
\`\`\`

## 📁 Project Structure

\`\`\`
.
├── frontend/ # React application with FSD
│ ├── src/
│ │ ├── app/ # Application layer
│ │ ├── pages/ # Route pages
│ │ ├── widgets/ # Complex UI blocks
│ │ ├── features/ # Business features
│ │ ├── entities/ # Business entities
│ │ └── shared/ # Shared resources
│ └── ...
├── backend/ # Node.js API
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── services/
│ │ └── ...
│ └── ...
├── shared/ # Shared types between frontend and backend
├── docker/ # Docker configurations
└── ... # Root configuration files
\`\`\`

## 🔧 Available Scripts

| Script            | Description                                |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Start all services in development mode     |
| `pnpm build`      | Build all packages                         |
| `pnpm lint`       | Lint all packages                          |
| `pnpm format`     | Format all files                           |
| `pnpm test`       | Run tests                                  |
| `pnpm type-check` | Check TypeScript types                     |
| `pnpm clean`      | Clean all build artifacts and node_modules |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TanStack](https://tanstack.com/)
