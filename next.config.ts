import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback; originals stay JPEG in public/images.
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
