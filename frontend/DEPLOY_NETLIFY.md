Netlify deployment steps for the frontend

1. Connect your Git repository to Netlify

- In Netlify dashboard, click "New site from Git" and connect your repository.
- Set the build command to `npm run build` and the publish directory to `dist`.

2. Set environment variable

- In Site settings → Build & deploy → Environment, add:
  - `VITE_API_BASE` = `https://<your-backend-host>/api`

3. (Optional) Deploy immediately from your machine using Netlify CLI

Install the CLI and deploy:
```bash
npm install -g netlify-cli
NETLIFY_AUTH_TOKEN=<your-token> netlify deploy --dir=dist --prod --site=<NETLIFY_SITE_ID>
```

You can generate `NETLIFY_AUTH_TOKEN` from https://app.netlify.com/user/applications#personal-access-tokens and obtain `NETLIFY_SITE_ID` from Site settings → Site information.

4. CI/CD: Automated deploy via GitHub Actions

- A GitHub Action workflow is provided at `.github/workflows/netlify-deploy.yml` that will build and deploy the frontend on pushes to `main` using the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets.

5. Backend CORS

- Ensure your backend `CORS_ORIGIN` includes your Netlify site origin (e.g. `https://your-site.netlify.app`) or set it to `*` for demo purposes.

6. Verify cross-device login

- After Netlify finishes deploying, open your site URL on a phone.
- Ensure the backend is publicly reachable and `VITE_API_BASE` points to it.
- If email verification is required and SMTP isn't configured, use the dev fallback `verification_codes.json` (not recommended for production).

Troubleshooting

- If authentication fails, verify `JWT_SECRET` and `CORS_ORIGIN` on the backend host, and ensure the frontend is using the correct `VITE_API_BASE`.
