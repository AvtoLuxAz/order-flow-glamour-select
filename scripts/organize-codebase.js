import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const srcDir = path.join(rootDir, "src");

// Directory structure
const directories = [
  "core/constants",
  "core/types",
  "core/security",
  "core/performance",
  "core/utils",
  "features/auth",
  "features/dashboard",
  "features/customers",
  "shared/components",
  "shared/hooks",
  "shared/styles",
  "shared/utils",
  "assets/images",
  "assets/fonts",
  "assets/icons",
  "app/providers",
  "app/routes",
  "app/store",
];

// Create directories
directories.forEach((dir) => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Move files to appropriate directories
const fileMoves = [
  {
    from: "src/shared/utils/api-client.ts",
    to: "src/core/utils/api-client.ts",
  },
  {
    from: "src/shared/utils/logger.ts",
    to: "src/core/utils/logger.ts",
  },
  {
    from: "src/shared/utils/validation.ts",
    to: "src/core/utils/validation.ts",
  },
  {
    from: "src/shared/components/ErrorBoundary.tsx",
    to: "src/shared/components/feedback/ErrorBoundary.tsx",
  },
  {
    from: "src/shared/components/WithStatus.tsx",
    to: "src/shared/components/feedback/WithStatus.tsx",
  },
  {
    from: "src/shared/components/CanAccess.tsx",
    to: "src/shared/components/auth/CanAccess.tsx",
  },
];

// Move files
fileMoves.forEach(({ from, to }) => {
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

// Create index files for better imports
const createIndexFile = (dir) => {
  const indexPath = path.join(dir, "index.ts");
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(
      indexPath,
      "// Export all components from this directory\n"
    );
    console.log(`Created index file: ${indexPath}`);
  }
};

// Create index files for component directories
[
  "src/shared/components",
  "src/shared/hooks",
  "src/core/utils",
  "src/core/types",
  "src/core/constants",
].forEach((dir) => {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath)) {
    createIndexFile(fullPath);
  }
});

console.log("Codebase organization complete!");
