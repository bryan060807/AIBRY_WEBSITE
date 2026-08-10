module.exports = {
  apps: [
    {
      name: "aibry-website",
      cwd: "C:/Users/bryan/aibry/projects/aibry_website",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3015",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3015",
        AIBRY_BACKEND_BASE_URL: "https://aibrylabs.com",
        AIBRY_WEBSITE_API_URL: "https://aibrylabs.com"
      }
    }
  ]
}
