# JavedanDrive

JavedanDrive is a full-stack personal cloud storage application built with Node.js and Express. It provides authenticated users with a Drive-style workspace for organizing folders and managing uploaded files.

The application uses PostgreSQL through Supabase for persistent application data and Supabase Storage for uploaded files. Prisma is used as the database ORM, while EJS provides server-rendered views. Client-side JavaScript adds AJAX-based dashboard navigation and actions without requiring a complete page reload for normal workspace operations.

## Features

- Local username/password authentication
- Google OAuth authentication
- GitHub OAuth authentication
- Session-based authentication with Passport
- Folder creation, renaming, navigation, and deletion
- Nested folder hierarchy
- File uploads
- File downloads
- File viewing
- File renaming and deletion
- Root-level file uploads
- AJAX dashboard navigation and actions
- Server-side request validation
- Responsive dark dashboard interface
- Supabase PostgreSQL database
- Supabase Storage for uploaded files
- Prisma database migrations

## Tech Stack

### Backend

- Node.js
- Express
- Passport.js
- express-session
- EJS
- express-validator
- method-override
- Prisma ORM

### Database and Storage

- Supabase PostgreSQL
- Supabase Storage
- Prisma Client

### Frontend

- EJS templates
- Vanilla JavaScript
- CSS
- Space Grotesk

### Deployment

- Render Web Service
- Supabase for PostgreSQL and Storage

## Architecture

The dashboard uses AJAX requests for navigation and workspace operations. The server continues to render the dashboard through EJS, while the client replaces dashboard content without requiring a complete browser page reload.

## Prerequisites

Install or create the following before running the project:

- Node.js
- npm
- A Supabase project
- A Supabase Storage bucket
- Google OAuth credentials if Google login is enabled
- GitHub OAuth credentials if GitHub login is enabled

## Supabase Setup

JavedanDrive uses Supabase for two separate responsibilities:

1. PostgreSQL database
2. Object/file storage

### 1. Create a Supabase project

Create a Supabase project and wait until the PostgreSQL database is available.

### 2. Configure the database

The project uses Prisma with PostgreSQL:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

`DATABASE_URL` should contain the database connection string used by Prisma.

`DIRECT_URL` should contain the direct PostgreSQL connection string used for Prisma operations such as migrations when required by the deployment setup.

Use the connection strings provided by Supabase rather than hard-coding database credentials in the repository.

### 3. Configure Supabase Storage

Create a Storage bucket for uploaded files.

Configure:

```text
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=
```

`SUPABASE_BUCKET` must match the bucket used by the application.

The service-role key is a privileged server-side credential. It must never be exposed to browser-side JavaScript or committed to Git.

## Environment Variables

Create a `.env` file in the project root for local development.

Example:

```env
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-database-url"

SECRET="your-session-secret"

SUPABASE_URL="your-supabase-project-url"
SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
SUPABASE_BUCKET="your-storage-bucket-name"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

NODE_ENV="development"
```

If `SESSION_SECRET` exists in your environment configuration, keep it only if it is referenced elsewhere in the application. The Express session configuration currently uses `SECRET`.

Never commit `.env` to source control.

A typical `.gitignore` should contain:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

During development, create new migrations with:

```bash
npx prisma migrate dev
```

## Running the Application

Start the application:

```bash
node app.js
```

The application should be available at:

```text
http://localhost:3000
```

## OAuth Configuration

The OAuth providers must point to the application's callback routes.

### Google

For local development:

```text
Authorized JavaScript origin:
http://localhost:3000

Authorized redirect URI:
http://localhost:3000/auth/google/callback
```

For production:

```text
Authorized JavaScript origin:
https://your-production-domain.com

Authorized redirect URI:
https://your-production-domain.com/auth/google/callback
```

### GitHub

For local development:

```text
Homepage URL:
http://localhost:3000

Authorization callback URL:
http://localhost:3000/auth/github/callback
```

For production:

```text
Homepage URL:
https://your-production-domain.com

Authorization callback URL:
https://your-production-domain.com/auth/github/callback
```

The callback URLs configured with Google and GitHub must match the callback URLs used by Passport.

## Database Model

The main database models are:

```text
User
Folder
File
Session
```

Folders support a self-referencing hierarchy:

```text
Folder
  |
  +-- children
        |
        +-- children
              |
              +-- ...
```

Files can optionally belong to a folder.

Folder deletion uses cascading database relations so that deleting a folder also removes its nested folders and associated file records instead of moving files into the root directory.

## File Storage

File metadata is stored in PostgreSQL while uploaded file objects are stored in Supabase Storage.

Database metadata includes information such as:

- Original filename
- Display filename
- MIME type
- File size
- Owner
- Folder
- Storage path
- Optional URL

This separates application metadata from the actual stored file objects.

## Security Notes

The following values are server-side secrets and must never be exposed publicly:

```text
SECRET
DATABASE_URL
DIRECT_URL
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_SECRET
```

Do not expose these values in EJS templates, client-side JavaScript, public files, or Git repositories.

Authentication-protected routes verify the current Passport session before allowing users to access private dashboard resources.

File and folder operations validate ownership before performing database operations.

## Production Deployment with Render

JavedanDrive can be deployed as a Render Web Service while continuing to use Supabase for PostgreSQL and Storage.

### Render settings

For a repository whose application is located at the repository root:

```text
Root Directory:
leave empty
```

Build command:

```bash
npm install && npx prisma generate
```

Pre-Deploy command:

```bash
npx prisma migrate deploy
```

Start command:

```bash
node app.js
```

Set:

```text
NODE_ENV=production
```

### Production environment variables

Configure the following in Render:

```text
DATABASE_URL
DIRECT_URL

SECRET

SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

NODE_ENV
```

Do not commit production credentials to the repository.

## Deployment Checklist

Before deploying:

- [ ] `.env` is excluded from Git
- [ ] Supabase database is configured
- [ ] Supabase Storage bucket exists
- [ ] `DATABASE_URL` is correct
- [ ] `DIRECT_URL` is correct
- [ ] Supabase storage credentials are configured
- [ ] Prisma Client can be generated
- [ ] Prisma migrations are committed
- [ ] Google OAuth callback URL is configured
- [ ] GitHub OAuth callback URL is configured
- [ ] Production OAuth credentials are available in Render
- [ ] `NODE_ENV` is set to `production`
- [ ] The application starts with `node app.js`

## Development Notes

The dashboard is server-rendered and uses vanilla JavaScript for progressive enhancement.

Normal navigation and workspace actions use AJAX where appropriate. This keeps the interface responsive while preserving the Express and EJS architecture.

The project does not require a frontend framework such as React or Vue.

## License

This project is currently intended as a personal/project application. Add a formal license if the repository will be distributed or reused publicly.
