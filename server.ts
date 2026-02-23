
import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // GitHub OAuth URL construction
  app.get("/api/auth/github/url", (req, res) => {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const redirectUri = `${appUrl}/auth/github/callback`;
    
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || "",
      redirect_uri: redirectUri,
      scope: "read:user user:follow",
      state: Math.random().toString(36).substring(7),
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params}`;
    res.json({ url: authUrl });
  });

  // GitHub OAuth Callback
  app.get("/auth/github/callback", async (req, res) => {
    const { code } = req.query;
    
    try {
      // Exchange code for token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Fetch user data
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = userResponse.data;

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  platform: 'Github',
                  data: ${JSON.stringify({
                    handle: userData.login,
                    followers: userData.followers,
                    public_repos: userData.public_repos,
                    created_at: userData.created_at
                  })}
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Arbiscan Proxy (to keep API key secret)
  app.get("/api/blockchain/history/:address", async (req, res) => {
    const { address } = req.params;
    const apiKey = process.env.ARBISCAN_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Arbiscan API key not configured" });
    }

    try {
      const response = await axios.get("https://api.arbiscan.io/api", {
        params: {
          module: "account",
          action: "txlist",
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 100,
          sort: "desc",
          apikey: apiKey,
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error("Arbiscan API error:", error);
      res.status(500).json({ error: "Failed to fetch blockchain history" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
