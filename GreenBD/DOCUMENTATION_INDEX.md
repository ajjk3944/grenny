# GreenBD Documentation Index

Complete guide to all documentation files in the GreenBD project.

## Quick Start

**New to the project?** Start here:
1. [README.md](#readmemd) - Project overview
2. [DEVELOPER_GUIDE.md](#developer_guidemd) - Quick reference
3. [FEATURES.md](#featuresmd) - What the app does

**Setting up?** Follow these:
1. [README.md](#readmemd) - Installation steps
2. [BUILD_GUIDE.md](#build_guidemd) - Building the app
3. [DEPLOYMENT_GUIDE.md](#deployment_guidemd) - Deploying to production

**Testing?** Check these:
1. [INTEGRATION_CHECKLIST.md](#integration_checklistmd) - Integration tests
2. [FINAL_CHECKLIST.md](#final_checklistmd) - Pre-launch checklist
3. [TESTING_GUIDE.md](#testing_guidemd) - Testing procedures

## Documentation Files

### Core Documentation

#### README.md
**Purpose:** Project overview and quick start guide

**Contents:**
- Project description
- Features overview
- Tech stack
- Prerequisites
- Quick start instructions
- Backend setup
- Building for production
- Project structure
- Environment variables

**When to use:** First time setup, general project information

---

#### DEVELOPER_GUIDE.md
**Purpose:** Quick reference for developers

**Contents:**
- Quick start commands
- Project structure
- Key utilities usage
- State management
- API services
- Components reference
- Common tasks
- Debugging tips
- Code style guide

**When to use:** Daily development, looking up how to do something

---

#### FEATURES.md
**Purpose:** Complete list of all features

**Contents:**
- User features
- Security features
- Admin features
- Technical features
- Feature status

**When to use:** Understanding what the app can do, feature planning

---

#### IMPLEMENTATION_STATUS.md
**Purpose:** Track implementation progress

**Contents:**
- Completed parts (1-9)
- Technology stack
- File structure
- Dependencies
- API endpoints required
- Configuration needed
- Testing checklist

**When to use:** Checking what's been completed, planning next steps

---

#### COMPLETION_SUMMARY.md
**Purpose:** Summary of Part 10 completion

**Contents:**
- What was completed in Part 10
- File structure summary
- Key features
- Testing checklist
- Next steps
- Configuration files
- Known limitations

**When to use:** Understanding Part 10 additions, final review

---

### Build & Deployment

#### BUILD_GUIDE.md
**Purpose:** Instructions for building the app

**Contents:**
- EAS setup
- Android builds (APK/AAB)
- iOS builds
- Environment configuration
- Version management
- Testing builds
- Troubleshooting build issues

**When to use:** Building APK/AAB for testing or production

---

#### DEPLOYMENT_GUIDE.md
**Purpose:** Deploying to production

**Contents:**
- Backend deployment
- Database setup
- Environment configuration
- Monitoring setup
- Rollback procedures
- Post-deployment checklist

**When to use:** Deploying backend, setting up production environment

---

#### eas.json
**Purpose:** EAS build configuration

**Contents:**
- Development profile
- Preview profile
- Production profile
- iOS profiles

**When to use:** Configuring builds, changing build settings

---

### Testing

#### INTEGRATION_CHECKLIST.md
**Purpose:** Integration testing checklist

**Contents:**
- Authentication testing
- Feature testing
- Performance testing
- Security testing
- Build testing
- Device testing matrix

**When to use:** Testing before release, QA process

---

#### FINAL_CHECKLIST.md
**Purpose:** Pre-launch checklist

**Contents:**
- Core integration status
- Performance optimization
- Error handling
- App configuration
- Asset checklist
- Security hardening
- Code quality
- Documentation status

**When to use:** Final review before production release

---

#### TESTING_GUIDE.md
**Purpose:** Testing procedures and guidelines

**Contents:**
- Testing strategy
- Unit testing
- Integration testing
- E2E testing
- Performance testing
- Security testing

**When to use:** Setting up tests, running test suites

---

### Performance & Security

#### PERFORMANCE.md
**Purpose:** Performance optimization guide

**Contents:**
- Startup performance
- Image optimization
- List performance
- Animation performance
- Memory management
- Network optimization
- Bundle size optimization
- Database performance
- Monitoring tools
- Common issues

**When to use:** Optimizing performance, troubleshooting slow operations

---

#### SECURITY.md
**Purpose:** Security best practices

**Contents:**
- Authentication & authorization
- API security
- Data security
- Network security
- Mobile app security
- Backend security
- Vulnerability prevention
- Incident response
- Compliance

**When to use:** Implementing security features, security audit

---

### API Documentation

#### server/API_DOCUMENTATION.md
**Purpose:** Complete API reference

**Contents:**
- Authentication endpoints
- Submission endpoints
- Points & leaderboard endpoints
- Benefits endpoints
- Security endpoints
- Admin endpoints
- Notification endpoints
- Map endpoints
- Challenge endpoints
- Educational endpoints
- Error codes
- Rate limiting

**When to use:** Implementing API calls, backend development

---

### Feature-Specific Guides

#### AUTH_GUIDE.md
**Purpose:** Authentication flow documentation

**Contents:**
- Authentication methods
- OTP flow
- Social login
- Admin/security login
- Token management
- Role-based access

**When to use:** Implementing auth features, troubleshooting auth issues

---

#### CAPTURE_QUICK_REF.md
**Purpose:** Quick reference for capture feature

**Contents:**
- Capture flow
- Camera permissions
- Media handling
- Form validation
- Offline support

**When to use:** Working on capture feature, understanding capture flow

---

#### CAPTURE_TESTING_GUIDE.md
**Purpose:** Testing the capture feature

**Contents:**
- Test scenarios
- Permission testing
- Media testing
- Offline testing
- Edge cases

**When to use:** Testing capture functionality

---

#### DASHBOARD_FEATURES.md
**Purpose:** Dashboard feature documentation

**Contents:**
- Dashboard components
- Points display
- Charts
- Leaderboard preview
- Quick stats

**When to use:** Working on dashboard, understanding dashboard features

---

#### DASHBOARD_LAYOUT.md
**Purpose:** Dashboard layout specifications

**Contents:**
- Layout structure
- Component placement
- Responsive design
- Theme support

**When to use:** Designing dashboard, implementing layout

---

#### DASHBOARD_SETUP.md
**Purpose:** Setting up the dashboard

**Contents:**
- Installation
- Configuration
- Data integration
- Customization

**When to use:** Initial dashboard setup

---

### Change Logs

#### CHANGELOG.md
**Purpose:** Track changes across versions

**Contents:**
- Version history
- New features
- Bug fixes
- Breaking changes

**When to use:** Understanding what changed, release notes

---

### Setup Scripts

#### install-dashboard.sh
**Purpose:** Automated setup for Linux/Mac

**Contents:**
- Dependency installation
- Environment setup
- Database setup
- Server start

**When to use:** First time setup on Linux/Mac

---

#### install-dashboard.bat
**Purpose:** Automated setup for Windows

**Contents:**
- Dependency installation
- Environment setup
- Database setup
- Server start

**When to use:** First time setup on Windows

---

#### setup.sh / setup.bat
**Purpose:** Quick setup scripts

**Contents:**
- Basic setup
- Dependency check
- Environment configuration

**When to use:** Quick project setup

---

## Documentation by Role

### For New Developers
1. README.md - Start here
2. DEVELOPER_GUIDE.md - Quick reference
3. FEATURES.md - What the app does
4. IMPLEMENTATION_STATUS.md - What's completed

### For Frontend Developers
1. DEVELOPER_GUIDE.md - Daily reference
2. PERFORMANCE.md - Optimization tips
3. DASHBOARD_FEATURES.md - Dashboard work
4. CAPTURE_QUICK_REF.md - Capture feature

### For Backend Developers
1. server/API_DOCUMENTATION.md - API reference
2. DEPLOYMENT_GUIDE.md - Deployment
3. SECURITY.md - Security practices
4. PERFORMANCE.md - Database optimization

### For QA/Testers
1. INTEGRATION_CHECKLIST.md - Integration tests
2. FINAL_CHECKLIST.md - Pre-launch checks
3. TESTING_GUIDE.md - Testing procedures
4. CAPTURE_TESTING_GUIDE.md - Capture testing

### For DevOps
1. DEPLOYMENT_GUIDE.md - Deployment procedures
2. BUILD_GUIDE.md - Build instructions
3. SECURITY.md - Security configuration
4. PERFORMANCE.md - Performance monitoring

### For Project Managers
1. FEATURES.md - Feature list
2. IMPLEMENTATION_STATUS.md - Progress tracking
3. FINAL_CHECKLIST.md - Launch readiness
4. CHANGELOG.md - Version history

## Documentation by Task

### Setting Up Development Environment
1. README.md - Installation
2. install-dashboard.sh/bat - Automated setup
3. DEVELOPER_GUIDE.md - Quick start

### Implementing New Features
1. DEVELOPER_GUIDE.md - Code patterns
2. FEATURES.md - Existing features
3. server/API_DOCUMENTATION.md - API endpoints

### Optimizing Performance
1. PERFORMANCE.md - Optimization guide
2. DEVELOPER_GUIDE.md - Best practices
3. TESTING_GUIDE.md - Performance testing

### Securing the Application
1. SECURITY.md - Security practices
2. AUTH_GUIDE.md - Authentication
3. server/API_DOCUMENTATION.md - API security

### Building for Production
1. BUILD_GUIDE.md - Build instructions
2. FINAL_CHECKLIST.md - Pre-launch checks
3. DEPLOYMENT_GUIDE.md - Deployment

### Testing the Application
1. INTEGRATION_CHECKLIST.md - Integration tests
2. TESTING_GUIDE.md - Test procedures
3. CAPTURE_TESTING_GUIDE.md - Feature testing

### Deploying to Production
1. DEPLOYMENT_GUIDE.md - Deployment steps
2. BUILD_GUIDE.md - Production builds
3. SECURITY.md - Security checklist

### Troubleshooting Issues
1. DEVELOPER_GUIDE.md - Common issues
2. BUILD_GUIDE.md - Build problems
3. PERFORMANCE.md - Performance issues

## Quick Reference

### Commands
```bash
# Development
npm start                    # Start dev server
npm run dev:android         # Run on Android
npm run dev:ios             # Run on iOS

# Building
npm run build:dev-apk       # Development APK
npm run build:preview-apk   # Preview APK
npm run build:prod          # Production AAB
npm run build:ios           # iOS build

# Backend
npm run server:dev          # Start backend
npm run server:build        # Build backend

# Testing
npm test                    # Run tests
npm run lint                # Lint code
npm run format              # Format code
```

### File Locations
- App code: `src/`
- Backend: `server/`
- Documentation: Root directory
- Assets: `assets/`
- Configuration: Root directory

### Key Files
- `app.json` - App configuration
- `eas.json` - Build configuration
- `.env` - Environment variables
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

## Keeping Documentation Updated

### When to Update
- After adding new features
- After fixing bugs
- After changing architecture
- Before releases
- When onboarding new team members

### What to Update
- CHANGELOG.md - Every change
- FEATURES.md - New features
- IMPLEMENTATION_STATUS.md - Progress
- API_DOCUMENTATION.md - API changes
- README.md - Major changes

### How to Update
1. Edit the relevant markdown file
2. Keep formatting consistent
3. Add examples where helpful
4. Update table of contents if needed
5. Commit with clear message

## Contributing to Documentation

### Guidelines
- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep formatting consistent
- Update index when adding files

### Markdown Style
- Use headers for sections
- Use code blocks for code
- Use lists for steps
- Use tables for comparisons
- Use links for references

## Getting Help

Can't find what you need?

1. Check this index
2. Search documentation files
3. Check code comments
4. Review examples in code
5. Ask team members

## Feedback

Found an issue with documentation?
- Create an issue
- Submit a pull request
- Contact the team

---

**Last Updated:** March 26, 2026
**Version:** 1.0.0
