require("dotenv").config();
const { execSync } = require("child_process");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const port = parseInt(process.env.PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const ensureBuildExists = () => {
  const buildPath = path.join(__dirname, ".next");
  if (!fs.existsSync(buildPath)) {
    console.log("No production build found. Running `next build`...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("Build completed successfully.");
    } catch (err) {
      console.error("Failed to build the project:", err.message);
      process.exit(1);
    }
  } else {
    console.log("Production build found.");
  }
};

app.prepare().then(() => {
  if (!dev) {
    ensureBuildExists(); // Ensure the build exists before starting the server
  }

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});