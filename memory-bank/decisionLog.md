# Decision Log

## Architecture Decisions

### Decision: Flask + React (Separate Frontend/Backend)
- **Context**: Need full-stack e-commerce platform
- **Decision**: Flask REST API backend with React SPA frontend
- **Rationale**: Clear separation of concerns, Flask's simplicity for API development, React's rich ecosystem for interactive UI

### Decision: JWT Authentication with Refresh Tokens
- **Context**: Need secure authentication for multiple user roles
- **Decision**: Flask-JWT-Extended with access tokens (2hr) + refresh tokens
- **Rationale**: Stateless authentication, refresh token pattern for better UX without long-lived access tokens

### Decision: PostgreSQL over SQLite
- **Context**: Production-ready database needed
- **Decision**: PostgreSQL with SQLAlchemy ORM
- **Rationale**: Better performance, concurrency support, production-grade reliability

### Decision: Role-Based Access (3 Roles)
- **Context**: Different user types need different capabilities
- **Decision**: customer, manager, super_admin roles
- **Rationale**: Clear separation of permissions, manager-specific stores, super_admin platform oversight

### Decision: Tiered Commission System
- **Context**: Platform needs to collect fees from store managers
- **Decision**: Price-based tiered commissions (5%/8%/10%)
- **Rationale**: Incentivize higher-priced items, simple to understand and implement

## UI/UX Decisions

### Decision: Tailwind CSS 4 + Custom Brand Colors
- **Context**: Need consistent, maintainable styling
- **Decision**: Tailwind with CSS custom properties for brand colors (gold, black, gray)
- **Rationale**: Utility-first rapid development, easy theming with CSS variables

### Decision: Brand Identity "Naqsh Couture"
- **Context**: Fashion marketplace needs strong brand presence
- **Decision**: Gold/black color scheme, Playfair Display + Inter fonts
- **Rationale**: Gold evokes luxury/fashion, serif+sans combo for elegant yet readable typography
