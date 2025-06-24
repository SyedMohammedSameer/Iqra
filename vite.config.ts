{
  "version": 2,
  "name": "iqra-learning",
  "builds": [
    {
      "src": "dist/server/index.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["uploads/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dist/server/index.js"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/client/index.html"
    }
  ],
  "functions": {
    "dist/server/index.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "outputDirectory": "dist/client",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "regions": ["iad1"]
}