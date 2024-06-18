import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true, // Enables protocol imports for Node.js core modules
    }),
  ],
  resolve: {
    alias: {
      // These aliases make sure that the Node.js modules point to the browser-compatible versions
      'util': 'rollup-plugin-node-polyfills/polyfills/util',
      'sys': 'util',
      'events': 'rollup-plugin-node-polyfills/polyfills/events',
      'stream': 'rollup-plugin-node-polyfills/polyfills/stream',
      'path': 'rollup-plugin-node-polyfills/polyfills/path',
      'querystring': 'rollup-plugin-node-polyfills/polyfills/qs',
      'punycode': 'rollup-plugin-node-polyfills/polyfills/punycode',
      'url': 'rollup-plugin-node-polyfills/polyfills/url',
      'string_decoder': 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      'http': 'rollup-plugin-node-polyfills/polyfills/http',
      'https': 'rollup-plugin-node-polyfills/polyfills/http',
      'os': 'rollup-plugin-node-polyfills/polyfills/os',
      'assert': 'rollup-plugin-node-polyfills/polyfills/assert',
      'constants': 'rollup-plugin-node-polyfills/polyfills/constants',
      '_stream_duplex': 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      '_stream_passthrough': 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      '_stream_readable': 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      '_stream_writable': 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      '_stream_transform': 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      'timers': 'rollup-plugin-node-polyfills/polyfills/timers',
      'console': 'rollup-plugin-node-polyfills/polyfills/console',
      'vm': 'rollup-plugin-node-polyfills/polyfills/vm',
      'zlib': 'rollup-plugin-node-polyfills/polyfills/zlib',
      'tty': 'rollup-plugin-node-polyfills/polyfills/tty',
      'domain': 'rollup-plugin-node-polyfills/polyfills/domain'
    }
  }
});
