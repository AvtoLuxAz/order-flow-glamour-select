# Order Flow Glamour Select

A modern React TypeScript application with best practices for security, performance, and maintainability.

## Features

### Security

- Encrypted local storage with AES-GCM
- CSRF protection
- XSS prevention
- Secure token management
- Session management
- User role and permission management

### Performance

- Performance monitoring with Web Vitals
- Debounce and throttle utilities
- Memoization helpers
- Virtual scrolling
- Lazy loading
- Image optimization
- RequestAnimationFrame utilities

### Architecture

- Feature-based folder structure
- Core utilities and types
- Shared components and hooks
- Proper TypeScript configurations
- Comprehensive logging system

## Project Structure

```
src/
├── app/                    # Application setup
│   ├── config/            # App configuration
│   ├── providers/         # Context providers
│   ├── routes/            # Route definitions
│   ├── store/             # State management
│   └── styles/            # Global styles
├── core/                  # Core functionality
│   ├── constants/         # Constants and configs
│   ├── security/          # Security utilities
│   ├── performance/       # Performance utilities
│   ├── types/            # TypeScript types
│   └── utils/            # Core utilities
├── features/             # Feature modules
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard
│   └── customers/        # Customer management
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   ├── hooks/           # Custom hooks
│   ├── styles/          # Shared styles
│   └── utils/           # Shared utilities
└── assets/              # Static assets
    ├── images/          # Images
    ├── fonts/           # Fonts
    └── icons/           # Icons
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Security Best Practices

### Encryption

- All sensitive data is encrypted using AES-GCM
- Secure key derivation with PBKDF2
- Random IV generation for each encryption
- Secure token storage

### CSRF Protection

- CSRF tokens for forms
- Token validation on requests
- Secure cookie handling

### XSS Prevention

- Input sanitization
- Content Security Policy
- HTML escaping utilities

## Performance Optimization

### Monitoring

- Web Vitals tracking
- Resource timing
- Performance metrics
- Custom performance measurements

### Optimization

- Virtual scrolling for large lists
- Image optimization
- Lazy loading
- Debounce and throttle
- Memoization

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Add comprehensive logging
- Write unit tests

### Security

- Never store sensitive data in plain text
- Use environment variables for secrets
- Implement proper validation
- Follow OWASP guidelines

### Performance

- Monitor bundle size
- Optimize images
- Use code splitting
- Implement caching
- Monitor performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
