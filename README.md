# Jira Clone

A Jira-like project management application built with NestJS backend application.

## Project Structure

```
jira/
├── src/                    # NestJS backend source code
│   ├── issues/            # Issues module
│   ├── auth/              # Authentication module
│   └── ...
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL or your configured database

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd jira
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your environment variables:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Issues
- `POST /issues` - Create a new issue
- `GET /issues` - Get all issues by board ID
- `GET /issues/:id` - Get issue by ID
- `PATCH /issues/:id` - Update an issue
- `DELETE /issues/:id` - Delete an issue
- `PATCH /issues/:id/move` - Move issue to different column
- `PATCH /issues/:id/reorder` - Reorder issue

All endpoints require JWT authentication via `JwtAuthGuard`.

## Features

- User authentication with JWT
- Create, read, update, and delete issues
- Move issues between columns
- Reorder issues
- Board management

## Technologies

- **Backend**: NestJS, TypeScript, Prisma
- **Authentication**: JWT
- **Database**: PostgreSQL

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
