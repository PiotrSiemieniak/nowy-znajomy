import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.discordapp.com"],
  },
};

const withNextIntl = createNextIntlPlugin('./i18n.ts')
export default withNextIntl(nextConfig);