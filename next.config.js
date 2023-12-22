import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: env.SKIP_TYPECHECK,
    }
};

export default config;
