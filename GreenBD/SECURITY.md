# GreenBD Security Guidelines

## Overview

This document outlines security best practices implemented in GreenBD and guidelines for maintaining security.

## Authentication & Authorization

### Token Storage

- JWT tokens are stored in SecureStore (encrypted storage)
- Never store tokens in AsyncStorage or plain text
- Tokens are cleared on logout
- Tokens expire after 7 days

```typescript
// Good
await secureStorage.setItem('token', token);

// Bad
await AsyncStorage.setItem('token', token);
```

### Password Security

- Passwords are hashed with bcrypt (10 rounds)
- Never log passwords
- Never send passwords in GET requests
- Enforce minimum password length (8 characters)
- Require password change for security users

### Session Management

- Implement token refresh mechanism
- Invalidate tokens on logout
- Detect and prevent concurrent sessions
- Implement session timeout

### Role-Based Access Control

- Verify user role on every protected route
- Admin routes require admin role
- Security routes require security role
- Never trust client-side role checks

```typescript
// Backend middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

## API Security

### Input Validation

- Validate all user inputs
- Sanitize inputs before processing
- Use schema validation (Zod, Joi)
- Reject invalid data early

```typescript
// Good
const schema = z.object({
  phone: z.string().regex(/^\+880\d{10}$/),
  name: z.string().min(2).max(50),
});

const data = schema.parse(req.body);
```

### Output Encoding

- Encode data before displaying
- Prevent XSS attacks
- Sanitize HTML content
- Use safe rendering methods

### Rate Limiting

- Implement rate limiting on all endpoints
- Stricter limits on authentication endpoints
- Use exponential backoff for retries
- Block abusive IPs

```typescript
// 5 requests per minute for auth
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});
```

### CORS Configuration

- Configure CORS properly
- Whitelist allowed origins
- Don't use wildcard (*) in production
- Validate Origin header

```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
};
```

## Data Security

### Sensitive Data

- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement data retention policies

### Personal Information

- Collect only necessary data
- Implement data minimization
- Allow users to delete their data
- Comply with privacy regulations

### Database Security

- Use parameterized queries (Prisma handles this)
- Never concatenate SQL strings
- Implement database access controls
- Regular database backups
- Encrypt database backups

### File Uploads

- Validate file types
- Limit file sizes
- Scan for malware
- Store files securely
- Use signed URLs for access

```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
const maxSize = 5 * 1024 * 1024; // 5MB

if (!allowedTypes.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}

if (file.size > maxSize) {
  throw new Error('File too large');
}
```

## Network Security

### HTTPS

- Use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS header
- Implement certificate pinning (optional)

### API Keys

- Never commit API keys to git
- Use environment variables
- Rotate keys regularly
- Use different keys for dev/prod

```typescript
// Good
const apiKey = process.env.OPENAI_API_KEY;

// Bad
const apiKey = 'sk-1234567890abcdef';
```

### Third-Party Services

- Vet third-party services
- Use official SDKs
- Keep SDKs updated
- Monitor for vulnerabilities

## Mobile App Security

### Code Obfuscation

- Enable ProGuard/R8 for Android
- Obfuscate JavaScript bundle
- Remove debug code in production
- Don't include source maps in production

### Secure Storage

- Use SecureStore for sensitive data
- Never store secrets in code
- Clear sensitive data on logout
- Implement data encryption

### Biometric Authentication

- Use biometric as convenience, not sole security
- Require password for sensitive operations
- Handle biometric failures gracefully
- Allow users to disable biometric

### Deep Linking

- Validate deep link parameters
- Don't trust data from deep links
- Implement URL scheme validation
- Prevent deep link hijacking

## Backend Security

### Environment Variables

- Never commit .env files
- Use different configs for environments
- Validate environment variables on startup
- Document required variables

### Error Handling

- Don't expose stack traces to clients
- Log errors securely
- Use generic error messages
- Implement error monitoring

```typescript
// Good
res.status(500).json({ error: 'Internal server error' });

// Bad
res.status(500).json({ error: error.stack });
```

### Logging

- Log security events
- Don't log sensitive data
- Implement log rotation
- Monitor logs for anomalies

### Dependencies

- Keep dependencies updated
- Audit dependencies regularly
- Remove unused dependencies
- Use lock files

```bash
npm audit
npm audit fix
```

## Vulnerability Prevention

### SQL Injection

- Use ORM (Prisma)
- Never concatenate SQL
- Validate inputs
- Use parameterized queries

### XSS (Cross-Site Scripting)

- Sanitize user inputs
- Encode outputs
- Use Content Security Policy
- Validate HTML content

### CSRF (Cross-Site Request Forgery)

- Use CSRF tokens
- Validate Origin header
- Use SameSite cookies
- Implement double-submit cookies

### Injection Attacks

- Validate all inputs
- Use safe APIs
- Avoid eval() and similar functions
- Sanitize command-line arguments

### Denial of Service

- Implement rate limiting
- Set request size limits
- Use timeouts
- Monitor resource usage

## Incident Response

### Detection

- Monitor for suspicious activity
- Set up alerts for anomalies
- Regular security audits
- Penetration testing

### Response Plan

1. Identify the incident
2. Contain the damage
3. Investigate the cause
4. Remediate vulnerabilities
5. Notify affected users
6. Document the incident

### Data Breach

1. Stop the breach
2. Assess the damage
3. Notify authorities (if required)
4. Notify affected users
5. Implement fixes
6. Review security practices

## Compliance

### GDPR (if applicable)

- Obtain user consent
- Allow data export
- Allow data deletion
- Implement data portability
- Maintain privacy policy

### Data Retention

- Define retention periods
- Automatically delete old data
- Allow users to delete data
- Document retention policies

## Security Checklist

### Development

- [ ] Use environment variables for secrets
- [ ] Validate all user inputs
- [ ] Sanitize outputs
- [ ] Use HTTPS
- [ ] Implement authentication
- [ ] Implement authorization
- [ ] Use secure storage
- [ ] Enable code obfuscation
- [ ] Remove debug code
- [ ] Audit dependencies

### Deployment

- [ ] Use production environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Enable error tracking
- [ ] Set up backups
- [ ] Test security measures
- [ ] Document security practices

### Maintenance

- [ ] Update dependencies regularly
- [ ] Monitor security advisories
- [ ] Review logs regularly
- [ ] Conduct security audits
- [ ] Test backup restoration
- [ ] Review access controls
- [ ] Rotate API keys
- [ ] Update security documentation

## Security Tools

### Static Analysis

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm test

# Run security tests
npm run test:security
```

## Reporting Security Issues

If you discover a security vulnerability:

1. Do NOT open a public issue
2. Email security@greenbd.com
3. Include detailed description
4. Include steps to reproduce
5. Allow time for fix before disclosure

## Resources

- OWASP Mobile Security Project
- OWASP API Security Top 10
- React Native Security Guide
- Expo Security Best Practices
- Node.js Security Best Practices

## Updates

This document should be reviewed and updated:
- After security incidents
- When adding new features
- When adopting new technologies
- At least quarterly

Last updated: 2024-01-01
