# Security Policy

## Supported Versions

The following versions of Indian Voter Guide are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

We take the security of this project seriously. If you believe you have found a security vulnerability, please report it to us by opening a GitHub Issue or contacting the maintainers directly.

### Security Best Practices Implemented:
1.  **Secret Management**: All API keys (Gemini, Google Civic) and Client IDs are stored in **Google Cloud Secret Manager** and injected at build time. They are never committed to the repository.
2.  **OAuth 2.0**: User authentication is handled exclusively through Google OAuth 2.0, ensuring no passwords or sensitive credentials are stored on our servers.
3.  **Content Security Policy (CSP)**: Our production deployment includes strict CSP headers to prevent XSS and data injection attacks.
4.  **Sanitization**: All user inputs (PIN codes, terms) are sanitized before being processed by the AI engine or stored in the local state.
5.  **Data Privacy**: No voter data is persisted on any server. All registration status and location data remains in the user's browser (Local Storage) and is cleared on logout.
