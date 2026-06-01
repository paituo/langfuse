/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import { withSentryConfig } from "@sentry/nextjs";
import { env } from "./src/env.mjs";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Allow building to alternate directory for parallel build checks while dev server runs
  distDir: process.env.NEXT_DIST_DIR || ".next",
  typescript: {
    // CI test jobs run `pnpm run typecheck` separately and skip duplicate
    // Next.js type checks to keep test builds fast. Production/Docker builds
    // do not set this flag and still fail on TypeScript errors.
    ignoreBuildErrors: process.env.NEXT_IGNORE_BUILD_ERRORS === "true",
  },
  // Agent/browser tooling often targets 127.0.0.1 instead of localhost in dev.
  allowedDevOrigins: ["127.0.0.1"],
  staticPageGenerationTimeout: 500, // default is 60. Required for build process for amd
  transpilePackages: ["@langfuse/shared", "vis-network/standalone"],
  reactStrictMode: true,
  serverExternalPackages: [
    "dd-trace",
    "@opentelemetry/api",
    "@appsignal/opentelemetry-instrumentation-bullmq",
    "bullmq",
    "@opentelemetry/sdk-node",
    "@opentelemetry/instrumentation-winston",
  ],
  poweredByHeader: false,
  basePath: env.NEXT_PUBLIC_BASE_PATH,
  compiler: {
    define: {
      "import.meta.vitest": "undefined",
    },
  },
  turbopack: {
    resolveAlias: {
      "@langfuse/shared": "./packages/shared/src",
    },
  },
  logging: {
    browserToTerminal: true,
  },
  experimental: {
    turbopackFileSystemCacheForBuild: true,
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en", "zh-CN"],
    defaultLocale: "en",
  },
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
      {
        source: "/generated/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
        ],
      },
    ];
  },

  webpack(config, { isServer, webpack }) {
    // Exclude Datadog packages from webpack bundling to avoid issues
    // see: https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/nodejs/#bundling-with-nextjs
    config.externals.push("@datadog/pprof", "dd-trace");

    // Setup in-source testing: https://vitest.dev/guide/in-source.html#other-bundlers
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.vitest": "undefined",
      }),
    );

    return config;
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const finalConfig = env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(withNextIntl(nextConfig), {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      reactComponentAnnotation: {
        enabled: true,
      },
      sourcemaps: {
        disable: true,
      },
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  : withNextIntl(nextConfig);

export default finalConfig;
