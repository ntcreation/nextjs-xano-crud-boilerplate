# Xano Integration Guide

Once you've set up your Xano database using the [XANO_SETUP.md](./XANO_SETUP.md) guide, follow these steps to connect it to your Next.js application.

## Step 1: Configure Environment Variables

1. **Copy your Xano credentials** from the Xano dashboard
2. **Edit `.env.local`** in your project root:

```bash
# Change from demo to xano mode
DATA_MODE=xano

# Add your Xano credentials
XANO_BASE_URL=https://your-instance.xano.io/api:version
XANO_API_KEY=your-api-key-here
XANO_SWAGGER_URL=https://your-instance.xano.io/api:version/swagger.json
```

## Step 2: Test the Connection

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your admin dashboard:** `http://localhost:3000/admin`

3. **Check the status indicator** - it should show "Xano Mode" instead of "Demo Mode"

## Step 3: Verify API Endpoints

The application will automatically switch to using your Xano database. Test the following:

### Test Users
- **List users:** Visit `/admin/users`
- **Create user:** Click "Add User" and fill in the form
- **Edit user:** Click edit on any user
- **Delete user:** Click delete on any user

### Test Posts  
- **List posts:** Visit `/admin/posts`
- **Create post:** Click "Add Post" and fill in the form
- **Edit post:** Click edit on any post
- **Delete post:** Click delete on any post

### Test Categories
- **List categories:** Visit `/admin/categories`
- **Create category:** Click "Add Category" and fill in the form
- **Edit category:** Click edit on any category
- **Delete category:** Click delete on any category

## Step 4: Troubleshooting

### Common Issues

**❌ "Missing required Xano environment variables"**
- Check that all environment variables are set in `.env.local`
- Restart your development server after changing environment variables

**❌ "Connection failed" or HTTP 401 errors**
- Verify your `XANO_API_KEY` is correct
- Check that your Xano instance is active
- Ensure your API key has the correct permissions

**❌ "HTTP 404" errors on API calls**
- Verify your `XANO_BASE_URL` is correct
- Check that your API endpoints exist in Xano
- Ensure endpoint paths match exactly (case-sensitive)

**❌ Data not appearing**
- Make sure your Xano tables have data
- Check browser dev tools Network tab for API errors
- Verify your database structure matches the expected schema

### Testing API Directly

You can test your Xano API directly with curl:

```bash
# Test get all users
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://your-instance.xano.io/api:version/users"

# Test create user  
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' \
  "https://your-instance.xano.io/api:version/users"
```

## Step 5: Switch Back to Demo Mode

If you need to switch back to demo mode:

1. **Edit `.env.local`:**
   ```bash
   DATA_MODE=demo
   ```

2. **Restart the development server**
3. **Visit `/admin`** - should show "Demo Mode"

## Advanced Configuration

### Custom Field Mappings

If your Xano database has different field names, you can customize the mappings in:
- `src/lib/types/index.ts` - Update type definitions
- `src/data/demo/index.ts` - Update demo data structure
- `src/lib/api/crud-service.ts` - Add field mapping logic

### Error Handling

The application includes comprehensive error handling:
- **Network errors** - Connection timeouts, server errors
- **Validation errors** - Missing required fields, invalid data
- **Authorization errors** - Invalid API keys, expired tokens

Errors are displayed in the UI with helpful messages and suggested solutions.

## Security Notes

⚠️ **Never commit API keys to version control**
- Use `.env.local` for local development
- Use environment variables in production (Vercel, Netlify, etc.)
- Regenerate API keys if accidentally exposed

🔒 **Production Deployment**
- Set environment variables in your deployment platform
- Use different Xano instances for development/staging/production
- Enable CORS settings in Xano for your domain

---

**Next Steps:**
- [Deploy to Production](./DEPLOYMENT.md)
- [Customize UI Components](./COMPONENTS.md)
- [Add Authentication](./AUTH.md)