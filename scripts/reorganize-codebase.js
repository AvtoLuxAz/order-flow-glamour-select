import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const srcDir = path.join(rootDir, "src");

// New directory structure
const newStructure = {
  core: {
    constants: {},
    types: {},
    security: {
      auth: {},
      encryption: {},
      validation: {},
    },
    performance: {
      monitoring: {},
      optimization: {},
    },
    utils: {
      api: {},
      logger: {},
      storage: {},
    },
  },
  features: {
    auth: {
      components: {},
      hooks: {},
      services: {},
      types: {},
    },
    dashboard: {
      components: {},
      hooks: {},
      services: {},
      types: {},
    },
    customers: {
      components: {},
      hooks: {},
      services: {},
      types: {},
    },
  },
  shared: {
    components: {
      feedback: {},
      forms: {},
      layout: {},
      navigation: {},
    },
    hooks: {},
    styles: {
      themes: {},
      base: {},
      components: {},
    },
    utils: {},
  },
  assets: {
    images: {},
    fonts: {},
    icons: {},
  },
  app: {
    providers: {},
    routes: {},
    store: {},
    styles: {},
  },
};

// Directories to remove
const directoriesToRemove = [
  "lib",
  "templates",
  "services",
  "models",
  "hooks",
  "context",
  "config",
  "components",
  "integrations",
];

// Files to move
const filesToMove = [
  {
    from: "src/core/utils/logger.ts",
    to: "src/core/utils/logger/index.ts",
  },
  {
    from: "src/core/utils/api-client.ts",
    to: "src/core/utils/api/client.ts",
  },
  {
    from: "src/core/security/index.ts",
    to: "src/core/security/auth/security-utils.ts",
  },
  {
    from: "src/core/performance/index.ts",
    to: "src/core/performance/optimization/performance-utils.ts",
  },
  {
    from: "src/App.css",
    to: "src/app/styles/app.css",
  },
  {
    from: "src/index.css",
    to: "src/app/styles/index.css",
  },
];

// Create directory structure
function createDirectoryStructure(structure, currentPath) {
  Object.entries(structure).forEach(([dir, subDirs]) => {
    const dirPath = path.join(currentPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${path.relative(srcDir, dirPath)}`);
    }
    if (Object.keys(subDirs).length > 0) {
      createDirectoryStructure(subDirs, dirPath);
    }
  });
}

// Remove unused directories
function removeUnusedDirectories() {
  directoriesToRemove.forEach((dir) => {
    const dirPath = path.join(srcDir, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Removed directory: ${dir}`);
    }
  });
}

// Move files to new locations
function moveFiles() {
  filesToMove.forEach(({ from, to }) => {
    const sourcePath = path.join(rootDir, from);
    const targetPath = path.join(rootDir, to);

    if (fs.existsSync(sourcePath)) {
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved: ${from} -> ${to}`);
    }
  });
}

// Create index files
function createIndexFiles(structure, currentPath) {
  Object.entries(structure).forEach(([dir, subDirs]) => {
    const dirPath = path.join(currentPath, dir);
    const indexPath = path.join(dirPath, "index.ts");

    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        "// Export all components from this directory\n"
      );
      console.log(`Created index file: ${path.relative(srcDir, indexPath)}`);
    }

    if (Object.keys(subDirs).length > 0) {
      createIndexFiles(subDirs, dirPath);
    }
  });
}

// Execute reorganization
console.log("Starting codebase reorganization...");
createDirectoryStructure(newStructure, srcDir);
removeUnusedDirectories();
moveFiles();
createIndexFiles(newStructure, srcDir);
console.log("Codebase reorganization complete!");
