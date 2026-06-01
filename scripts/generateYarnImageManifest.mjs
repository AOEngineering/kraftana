import fs from "node:fs"
import path from "node:path"
const root = process.cwd()
const publicImages = path.join(root, "public", "images")
const files = []
function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(p)
    } else if (/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(entry.name)) {
      files.push(path.relative(root, p).replace(/\\/g, "/"))
    }
  }
}
walk(publicImages)
const yarnImages = files.filter((item) => item.startsWith("public/images/yarn/") || item.includes("/images/yarn/"))
const outputPath = path.join(root, "src/lib/data/yarnImageManifest.json")
fs.writeFileSync(
  outputPath,
  JSON.stringify({ imagePaths: yarnImages.map((item) => item.replace(/^public/, "")) }, null, 2)
)
console.log(`wrote ${yarnImages.length} yarn image paths`)
