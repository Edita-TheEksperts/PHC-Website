const CHUNK_PUBLIC_PATH = "server/pages/BlogPage.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__b2b14c._.js");
runtime.loadChunk("server/chunks/ssr/node_modules_599eec._.js");
runtime.loadChunk("server/chunks/ssr/src_styles_globals_070f83.css");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/src/pages/BlogPage.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/src/pages/_document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/src/pages/_app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
