# Xano Database Setup Guide

This guide walks you through setting up a blank Xano database and connecting it to the Next.js CRUD boilerplate.

## Step 1: Create Xano Account & Workspace

1. **Sign up at [Xano.com](https://xano.com)**
2. **Create a new workspace** (or use existing)
3. **Create a new instance** for this project

## Step 2: Set Up Database Tables

### Users Table
1. Go to **Database > Add Table**
2. Name: `users`
3. Add these fields:
   - `id` (Integer, Primary Key, Auto Increment) - *auto-created*
   - `name` (Text, Required)
   - `email` (Text, Required, Unique)
   - `created_at` (DateTime, Default: now()) - *auto-created*

### Posts Table  
1. **Database > Add Table**
2. Name: `posts`
3. Add these fields:
   - `id` (Integer, Primary Key, Auto Increment) - *auto-created*
   - `title` (Text, Required)
   - `content` (Long Text)
   - `author_id` (Integer, Foreign Key → users.id)
   - `published` (Boolean, Default: false)
   - `created_at` (DateTime, Default: now()) - *auto-created*

### Categories Table
1. **Database > Add Table** 
2. Name: `categories`
3. Add these fields:
   - `id` (Integer, Primary Key, Auto Increment) - *auto-created*
   - `name` (Text, Required, Unique)
   - `description` (Text)
   - `color` (Text, Default: '#3B82F6')
   - `created_at` (DateTime, Default: now()) - *auto-created*

## Step 3: Create API Endpoints

### Users Endpoints
1. **API > Add Function Group** → Name: `users`
2. Create these endpoints:

**GET /users** (List all users)
- Method: GET
- Path: `/users`
- Query: `SELECT * FROM users ORDER BY created_at DESC`

**GET /users/{id}** (Get single user)
- Method: GET  
- Path: `/users/{id}`
- Input: `id` (Integer, Path Parameter)
- Query: `SELECT * FROM users WHERE id = {id}`

**POST /users** (Create user)
- Method: POST
- Path: `/users`
- Inputs: `name` (Text), `email` (Text)
- Query: `INSERT INTO users (name, email) VALUES ({name}, {email})`

**PUT /users/{id}** (Update user)
- Method: PUT
- Path: `/users/{id}`
- Inputs: `id` (Integer, Path), `name` (Text), `email` (Text)
- Query: `UPDATE users SET name = {name}, email = {email} WHERE id = {id}`

**DELETE /users/{id}** (Delete user)
- Method: DELETE
- Path: `/users/{id}`
- Input: `id` (Integer, Path Parameter)
- Query: `DELETE FROM users WHERE id = {id}`

### Posts Endpoints
Repeat the same pattern for `posts` table:
- GET `/posts`
- GET `/posts/{id}`
- POST `/posts`
- PUT `/posts/{id}`
- DELETE `/posts/{id}`

### Categories Endpoints  
Repeat the same pattern for `categories` table:
- GET `/categories`
- GET `/categories/{id}`
- POST `/categories`
- PUT `/categories/{id}`
- DELETE `/categories/{id}`

## Step 4: Generate API Documentation

1. **API > Settings**
2. **Enable Swagger Documentation**
3. **Copy your Swagger JSON URL** (e.g., `https://your-instance.xano.io/api:version/swagger.json`)

## Step 5: Get Your API Credentials

1. **Settings > API Keys**
2. **Generate API Key** (copy this - you'll need it)
3. **Copy your Base URL** (e.g., `https://your-instance.xano.io/api:version`)

## Step 6: Test Your API

You can test endpoints in Xano's built-in API playground or with curl:

\`\`\`bash
# Test get all users
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://your-instance.xano.io/api:version/users"

# Test create user
curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com"}' \\
  "https://your-instance.xano.io/api:version/users"
\`\`\`

## Next Steps

Once your Xano database is set up:
1. Copy your API credentials
2. Configure environment variables in your Next.js app
3. Switch from demo mode to Xano mode
4. Test the connection

---

**Need Help?** 
- [Xano Documentation](https://docs.xano.com)
- [Xano Community](https://community.xano.com)

## Quick Reference

### Your Credentials (fill these in):
- **Base URL:** `https://your-instance.xano.io/api:version`
- **API Key:** `your-api-key-here`
- **Swagger URL:** `https://your-instance.xano.io/api:version/swagger.json`