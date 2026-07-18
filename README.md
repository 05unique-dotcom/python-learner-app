# 🐍 Python Learner App

> An interactive web-based Python learning platform designed to help beginners master Python programming with lessons, quizzes, badges, and certificates.

[![GitHub stars](https://img.shields.io/github/stars/05unique-dotcom/python-learner-app?style=social)](https://github.com/05unique-dotcom/python-learner-app)
[![GitHub forks](https://img.shields.io/github/forks/05unique-dotcom/python-learner-app?style=social)](https://github.com/05unique-dotcom/python-learner-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**📂 GitHub Repository:** https://github.com/05unique-dotcom/python-learner-app

---

## ✨ Features

- 📚 **Structured Lessons** - Learn Python concepts step-by-step
- 🎯 **Interactive Quizzes** - Test your knowledge after each lesson
- 🏆 **Badge System** - Earn badges as you progress
- 🎓 **Certificate of Completion** - Get a certificate after finishing the course
- 🌐 **Modern Web Interface** - Built with React and Tailwind CSS
- 🚀 **Live Preview** - See code examples in real-time
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🎮 Live Demo

Check out the live version here:
> **[Python Learner App - Live Demo](https://python-learner--05unique7057.replit.app)**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 24+
- pnpm (package manager)
- PostgreSQL (for database)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/05unique-dotcom/python-learner-app.git
cd python-learner-app

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your configuration:
# - DATABASE_URL: PostgreSQL connection string
# - PORT: Server port (e.g., 5000)
# - BASE_PATH: Base path for Vite build (e.g., /)

# 4. Initialize the database
pnpm --filter @workspace/db run push

# 5. Start the API server (Terminal 1)
pnpm --filter @workspace/api-server run dev

# 6. Start the frontend (Terminal 2)
cd apps/web && pnpm dev
```

The app will be available at `http://localhost:5173` (frontend) and API at `http://localhost:5000`.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Vite + TypeScript |
| **Backend** | Express 5 + Node.js 24 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **API** | REST API + OpenAPI spec |
| **Validation** | Zod + drizzle-zod |
| **State Management** | TanStack React Query |
| **Package Manager** | pnpm workspaces |

---

## 📁 Project Structure

```
python-learner-app/
├── packages/
│   ├── api-server/              # Express backend
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── index.ts
│   │   │   └── routes/
│   │   └── drizzle.config.ts
│   │
│   ├── db/                      # Database schemas & ORM
│   │   └── src/
│   │       ├── index.ts
│   │       └── schema/
│   │
│   ├── api-spec/                # OpenAPI specification
│   │   └── orval.config.ts
│   │
│   └── lib/
│       ├── api-client-react/    # Generated API hooks
│       └── api-zod/             # Generated validation schemas
│
└── apps/
    └── web/                     # React frontend
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   └── main.tsx
        └── vite.config.ts
```

---

## 🎯 Planned Features (Future)

- [ ] User authentication & registration
- [ ] Learning progress tracking dashboard
- [ ] More Python topics & advanced courses
- [ ] AI-powered coding assistant
- [ ] Coding challenges with difficulty levels
- [ ] Dark mode support
- [ ] Community forum
- [ ] Leaderboard system
- [ ] Mobile app

---

## 🔧 Common Commands

```bash
# Type checking across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Regenerate API hooks and Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push database schema changes (development)
pnpm --filter @workspace/db run push

# Start development servers
pnpm run dev
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** this repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test them
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to your fork (`git push origin feature/amazing-feature`)
6. **Open a Pull Request** describing your changes

### Contribution Ideas
- Add new Python lessons
- Improve quiz questions
- Fix bugs or improve performance
- Add translations
- Improve UI/UX
- Write documentation

---

## 📝 Environment Variables

Create a `.env` file in the root directory with:

```env
# Database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/python_learner

# API Server port
PORT=5000

# Vite base path (use "/" for root deployment)
BASE_PATH=/
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Use a different port
PORT=5001 pnpm --filter @workspace/api-server run dev
```

### Database connection error
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials

### Dependencies installation fails
```bash
# Clear pnpm cache and reinstall
pnpm store prune
pnpm install
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Arshad Ansari**
- GitHub: [@05unique-dotcom](https://github.com/05unique-dotcom)
- Email: Contact via GitHub

---

## ⭐ Show Your Support

If you found this project helpful, please:
- ⭐ Give it a star on GitHub
- 🍴 Fork it for your own learning
- 💬 Share feedback and suggestions
- 🤝 Contribute improvements

Your support motivates me to build more educational and open-source projects! 🚀

---

## 🔗 Useful Links

- [Python Official Documentation](https://docs.python.org/3/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)

---

## 📞 Need Help?

- 📖 Check the [Issues](https://github.com/05unique-dotcom/python-learner-app/issues) section
- 💡 Create a [Discussion](https://github.com/05unique-dotcom/python-learner-app/discussions)
- 🐛 Report a bug by opening an [Issue](https://github.com/05unique-dotcom/python-learner-app/issues/new)

---

**Happy Learning! 🎓**
