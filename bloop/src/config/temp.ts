import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const tempPath = path.join(os.tmpdir(), "blob");

if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath);
}