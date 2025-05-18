# Glamour Studio - Order Flow Management System

A modern, feature-rich order flow management system for beauty and wellness businesses.

## Features

- 🎨 Modern UI with brand colors
- 📱 Responsive design
- 🔄 Real-time updates
- 📊 Comprehensive reporting
- 💰 Payment tracking
- 👥 Customer management
- 📅 Appointment scheduling
- 🛍️ Product and service management
- 👨‍💼 Staff management and payroll

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Supabase (Backend)
- React Query
- React Router
- React Hook Form
- Zod (Validation)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Glamour Studio
VITE_APP_URL=http://localhost:5173
```

2. Set up your Supabase project:
   - Create a new project in Supabase
   - Run the migrations in `supabase/migrations/20240320000000_initial_schema.sql`
   - Enable Row Level Security (RLS) policies
   - Set up storage buckets for images

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/glamour-studio.git
cd glamour-studio
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
/src
  /features           # Feature-based modules
    /customers       # Customer management
    /appointments    # Appointment scheduling
    /services        # Service management
    /products        # Product management
    /staff          # Staff management
    /cash           # Payment tracking
    /customerFlow   # Customer flow management
  /shared            # Shared components and utilities
    /components     # Reusable components
    /utils          # Utility functions
    /hooks          # Custom React hooks
  /lib              # Core libraries and configurations
    /supabase.ts    # Supabase client
    /database.types.ts # Database types
```

## Database Schema

The application uses the following main tables:

- customers
- appointments
- services
- products
- staff
- payments
- salary_transactions
- work_logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
