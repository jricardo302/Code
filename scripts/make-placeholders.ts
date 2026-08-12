/**
 * Renders the placeholder photography as JPEGs into public/images.
 *
 * These are deliberate, on-palette scene illustrations — not grey boxes — so
 * the site reads correctly until the real photos of Kaya Platio 18 replace
 * them: drop your JPEGs over the same filenames and delete this script's
 * output from your workflow. Run with: npx tsx scripts/make-placeholders.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public/images");

const palette = {
  navy: "#0B2C3D",
  navyDeep: "#071E2B",
  sand: "#F4EFE6",
  sandDeep: "#E9E1D2",
  terracotta: "#B4552F",
  terracottaDeep: "#93441F",
  turquoise: "#1FA5A0",
  turquoiseSoft: "#63C4C0",
  dusk: "#123C52",
  gold: "#E8A64C",
};

/** A palm silhouette, drawn once, placed with transforms. */
function palm(x: number, y: number, scale: number, tone: string): string {
  const fronds = [
    "M0 0 C -30 -28, -75 -36, -110 -22 C -70 -30, -32 -18, 0 0",
    "M0 0 C 30 -28, 75 -36, 110 -22 C 70 -30, 32 -18, 0 0",
    "M0 0 C -18 -36, -40 -66, -78 -76 C -42 -58, -16 -30, 0 0",
    "M0 0 C 18 -36, 40 -66, 78 -76 C 42 -58, 16 -30, 0 0",
    "M0 0 C -6 -40, -6 -74, -20 -98 C -2 -70, 4 -38, 0 0",
    "M0 0 C 8 -40, 10 -74, 26 -96 C 6 -68, -2 -38, 0 0",
  ]
    .map((d) => `<path d="${d}" fill="${tone}"/>`)
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-3 0 C -8 60, 4 120, 14 180 L 26 180 C 12 118, 4 60, 5 0 Z" fill="${tone}"/>
    ${fronds}
  </g>`;
}

/** The bungalow silhouette: hipped tile roof, porch, warm windows. */
function bungalow(x: number, y: number, w: number, warmWindows: boolean): string {
  const h = w * 0.34;
  const win = warmWindows ? palette.gold : "#0d3145";
  return `<g transform="translate(${x} ${y})">
    <path d="M${w * 0.06} 0 L ${w * 0.24} ${-h * 0.62} L ${w * 0.76} ${-h * 0.62} L ${w * 0.94} 0 Z" fill="${palette.terracottaDeep}"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="${palette.sandDeep}" opacity="0.92"/>
    <rect x="${w * 0.1}" y="${h * 0.22}" width="${w * 0.14}" height="${h * 0.4}" rx="2" fill="${win}"/>
    <rect x="${w * 0.32}" y="${h * 0.22}" width="${w * 0.14}" height="${h * 0.55}" rx="2" fill="${win}"/>
    <rect x="${w * 0.56}" y="${h * 0.22}" width="${w * 0.3}" height="${h * 0.62}" rx="3" fill="${win}" opacity="0.85"/>
    <rect x="${w * 0.52}" y="${-h * 0.08}" width="${w * 0.04}" height="${h}" fill="${palette.navyDeep}" opacity="0.25"/>
  </g>`;
}

function bougainvillea(x: number, y: number, r: number): string {
  const blobs = Array.from({ length: 7 }, (_, i) => {
    const angle = (i / 7) * Math.PI * 2;
    return `<circle cx="${x + Math.cos(angle) * r * 0.55}" cy="${y + Math.sin(angle) * r * 0.35}" r="${r * (0.32 + (i % 3) * 0.1)}" fill="#C2497B" opacity="${0.5 + (i % 2) * 0.25}"/>`;
  }).join("");
  return `<g>${blobs}<circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#A93A68"/></g>`;
}

interface Scene {
  file: string;
  width: number;
  height: number;
  svg: () => string;
}

const W = 2400;
const H = 1350;

function sky(id: string, top: string, mid: string, bottom: string): string {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/>
    <stop offset="0.62" stop-color="${mid}"/>
    <stop offset="1" stop-color="${bottom}"/>
  </linearGradient>`;
}

const scenes: Scene[] = [
  {
    // The hero: dusk over the pool, the horizon-glow motif embedded.
    file: "hero.jpg",
    width: W,
    height: H,
    svg: () => `
      <defs>
        ${sky("s", palette.navyDeep, palette.dusk, "#1B5468")}
        <radialGradient id="glow" cx="0.5" cy="0.62" r="0.55">
          <stop offset="0" stop-color="${palette.turquoiseSoft}" stop-opacity="0.5"/>
          <stop offset="1" stop-color="${palette.turquoiseSoft}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${palette.turquoise}"/>
          <stop offset="1" stop-color="#0E6E6A"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <rect y="${H * 0.615}" width="${W}" height="3" fill="${palette.turquoiseSoft}" opacity="0.8"/>
      ${bungalow(W * 0.3, H * 0.6, W * 0.34, true)}
      ${bougainvillea(W * 0.71, H * 0.62, 70)}
      ${palm(W * 0.83, H * 0.28, 2.4, palette.navyDeep)}
      ${palm(W * 0.12, H * 0.4, 1.6, "#0A2836")}
      <rect x="${W * 0.2}" y="${H * 0.78}" width="${W * 0.6}" height="${H * 0.16}" rx="18" fill="url(#pool)"/>
      <rect x="${W * 0.31}" y="${H * 0.8}" width="${W * 0.1}" height="${H * 0.1}" rx="8" fill="${palette.gold}" opacity="0.28"/>
      <rect x="${W * 0.55}" y="${H * 0.81}" width="${W * 0.14}" height="${H * 0.09}" rx="8" fill="${palette.turquoiseSoft}" opacity="0.3"/>
    `,
  },
  {
    file: "house-porch.jpg",
    width: W,
    height: H,
    svg: () => `
      <defs>${sky("s", "#2C7FA3", "#7FBFD4", palette.sand)}</defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      ${bungalow(W * 0.12, H * 0.66, W * 0.55, false)}
      ${palm(W * 0.85, H * 0.3, 2.2, "#12475C")}
      ${bougainvillea(W * 0.76, H * 0.68, 90)}
      <rect y="${H * 0.86}" width="${W}" height="${H * 0.14}" fill="${palette.sandDeep}"/>
    `,
  },
  {
    file: "house-interior.jpg",
    width: W,
    height: H,
    svg: () => `
      <rect width="${W}" height="${H}" fill="${palette.sand}"/>
      <rect width="${W}" height="${H * 0.62}" fill="${palette.sandDeep}"/>
      <rect x="${W * 0.08}" y="${H * 0.14}" width="${W * 0.24}" height="${H * 0.62}" rx="12" fill="#2C7FA3"/>
      <rect x="${W * 0.1}" y="${H * 0.16}" width="${W * 0.2}" height="${H * 0.58}" rx="8" fill="#7FBFD4"/>
      <rect x="${W * 0.42}" y="${H * 0.5}" width="${W * 0.44}" height="${H * 0.3}" rx="14" fill="${palette.navy}"/>
      <rect x="${W * 0.46}" y="${H * 0.42}" width="${W * 0.36}" height="${H * 0.08}" rx="8" fill="${palette.terracotta}"/>
      <circle cx="${W * 0.64}" cy="${H * 0.24}" r="${H * 0.06}" fill="${palette.gold}" opacity="0.85"/>
    `,
  },
  {
    file: "garden-pool.jpg",
    width: W,
    height: H,
    svg: () => `
      <defs>${sky("s", "#2C7FA3", "#63C4C0", "#BFE3DE")}
      <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${palette.turquoiseSoft}"/>
        <stop offset="1" stop-color="${palette.turquoise}"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      <rect y="${H * 0.5}" width="${W}" height="${H * 0.5}" fill="${palette.sandDeep}"/>
      <rect x="${W * 0.12}" y="${H * 0.56}" width="${W * 0.76}" height="${H * 0.34}" rx="24" fill="url(#pool)"/>
      <path d="M${W * 0.2} ${H * 0.66} q ${W * 0.08} ${H * 0.02} ${W * 0.16} 0" stroke="#fff" stroke-width="6" fill="none" opacity="0.5"/>
      <path d="M${W * 0.5} ${H * 0.74} q ${W * 0.1} ${H * 0.02} ${W * 0.2} 0" stroke="#fff" stroke-width="6" fill="none" opacity="0.4"/>
      ${palm(W * 0.08, H * 0.24, 2.0, "#12475C")}
      ${bougainvillea(W * 0.9, H * 0.5, 80)}
    `,
  },
  {
    file: "garden-wall.jpg",
    width: W,
    height: H,
    svg: () => `
      <defs>${sky("s", "#2C7FA3", "#8CC8DB", palette.sand)}</defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      <rect y="${H * 0.55}" width="${W}" height="${H * 0.24}" fill="#FBF8F1"/>
      <rect y="${H * 0.79}" width="${W}" height="${H * 0.21}" fill="${palette.sandDeep}"/>
      ${bougainvillea(W * 0.24, H * 0.5, 110)}
      ${bougainvillea(W * 0.4, H * 0.56, 70)}
      ${palm(W * 0.78, H * 0.2, 2.4, "#12475C")}
      <rect x="${W * 0.55}" y="${H * 0.6}" width="${W * 0.16}" height="${H * 0.19}" fill="${palette.navyDeep}" rx="4"/>
    `,
  },
  {
    file: "island-beach.jpg",
    width: W,
    height: H,
    svg: () => `
      <defs>${sky("s", "#1D6E96", "#2C7FA3", "#63C4C0")}
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0E5D80"/>
        <stop offset="0.55" stop-color="${palette.turquoise}"/>
        <stop offset="1" stop-color="#9ADCD4"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      <rect y="${H * 0.46}" width="${W}" height="${H * 0.38}" fill="url(#sea)"/>
      <path d="M0 ${H * 0.84} Q ${W * 0.4} ${H * 0.74} ${W} ${H * 0.88} L ${W} ${H} L 0 ${H} Z" fill="${palette.sand}"/>
      ${palm(W * 0.14, H * 0.36, 2.6, "#0F4051")}
      <circle cx="${W * 0.78}" cy="${H * 0.2}" r="${H * 0.07}" fill="#FBF3DC" opacity="0.9"/>
      <ellipse cx="${W * 0.62}" cy="${H * 0.56}" rx="${W * 0.02}" ry="${H * 0.012}" fill="#fff" opacity="0.7"/>
      <ellipse cx="${W * 0.5}" cy="${H * 0.62}" rx="${W * 0.014}" ry="${H * 0.01}" fill="#fff" opacity="0.5"/>
    `,
  },
  {
    file: "island-willemstad.jpg",
    width: W,
    height: H,
    svg: () => {
      const colors = ["#C86B4A", "#E8A64C", "#2C7FA3", palette.turquoise, "#C2497B", palette.sandDeep];
      const houses = colors
        .map((c, i) => {
          const x = W * (0.06 + i * 0.15);
          const h = H * (0.3 + (i % 3) * 0.06);
          return `<g>
            <rect x="${x}" y="${H * 0.62 - h}" width="${W * 0.13}" height="${h}" fill="${c}"/>
            <path d="M${x} ${H * 0.62 - h} L ${x + W * 0.065} ${H * 0.62 - h - H * 0.07} L ${x + W * 0.13} ${H * 0.62 - h} Z" fill="#FBF8F1"/>
            <rect x="${x + W * 0.02}" y="${H * 0.62 - h * 0.7}" width="${W * 0.025}" height="${h * 0.22}" fill="#FBF8F1" opacity="0.85"/>
            <rect x="${x + W * 0.075}" y="${H * 0.62 - h * 0.7}" width="${W * 0.025}" height="${h * 0.22}" fill="#FBF8F1" opacity="0.85"/>
          </g>`;
        })
        .join("");
      return `
      <defs>${sky("s", "#2C7FA3", "#8CC8DB", "#BFE3DE")}</defs>
      <rect width="${W}" height="${H}" fill="url(#s)"/>
      ${houses}
      <rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" fill="#0E5D80"/>
      <rect y="${H * 0.62}" width="${W}" height="${H * 0.06}" fill="${palette.turquoise}" opacity="0.6"/>
      `;
    },
  },
  {
    // Open Graph card, 1200x630.
    file: "og.jpg",
    width: 1200,
    height: 630,
    svg: () => `
      <defs>${sky("s", palette.navyDeep, palette.dusk, "#1B5468")}
      <radialGradient id="glow" cx="0.5" cy="0.7" r="0.6">
        <stop offset="0" stop-color="${palette.turquoiseSoft}" stop-opacity="0.5"/>
        <stop offset="1" stop-color="${palette.turquoiseSoft}" stop-opacity="0"/>
      </radialGradient></defs>
      <rect width="1200" height="630" fill="url(#s)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <rect y="437" width="1200" height="2" fill="${palette.turquoiseSoft}" opacity="0.8"/>
      ${palm(1050, 190, 1.6, palette.navyDeep)}
      ${bungalow(390, 430, 420, true)}
      <text x="600" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="${palette.sand}">Lighthouse Curaçao</text>
    `,
  },
];

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  for (const scene of scenes) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}">${scene.svg()}</svg>`;
    const jpeg = await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    writeFileSync(path.join(OUT, scene.file), jpeg);
    console.log(`wrote public/images/${scene.file} (${Math.round(jpeg.length / 1024)} kB)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
