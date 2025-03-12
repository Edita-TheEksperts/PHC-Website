(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__e0a812._.js", {

"[turbopack]/browser/dev/hmr-client/websocket.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// Adapted from https://github.com/vercel/next.js/blob/canary/packages/next/src/client/dev/error-overlay/websocket.ts
__turbopack_esm__({
    "addMessageListener": (()=>addMessageListener),
    "connectHMR": (()=>connectHMR),
    "sendMessage": (()=>sendMessage)
});
let source;
const eventCallbacks = [];
// TODO: add timeout again
// let lastActivity = Date.now()
function getSocketProtocol(assetPrefix) {
    let protocol = location.protocol;
    try {
        // assetPrefix is a url
        protocol = new URL(assetPrefix).protocol;
    } catch (_) {}
    return protocol === "http:" ? "ws" : "wss";
}
function addMessageListener(cb) {
    eventCallbacks.push(cb);
}
function sendMessage(data) {
    if (!source || source.readyState !== source.OPEN) return;
    return source.send(data);
}
function connectHMR(options) {
    const { timeout = 5 * 1000 } = options;
    function init() {
        if (source) source.close();
        console.log("[HMR] connecting...");
        function handleOnline() {
            const connected = {
                type: "turbopack-connected"
            };
            eventCallbacks.forEach((cb)=>{
                cb(connected);
            });
            if (options.log) console.log("[HMR] connected");
        // lastActivity = Date.now()
        }
        function handleMessage(event) {
            // lastActivity = Date.now()
            const message = {
                type: "turbopack-message",
                data: JSON.parse(event.data)
            };
            eventCallbacks.forEach((cb)=>{
                cb(message);
            });
        }
        // let timer: NodeJS.Timeout
        function handleDisconnect() {
            source.close();
            setTimeout(init, timeout);
        }
        const { hostname, port } = location;
        const protocol = getSocketProtocol(options.assetPrefix || "");
        const assetPrefix = options.assetPrefix.replace(/^\/+/, "");
        let url = `${protocol}://${hostname}:${port}${assetPrefix ? `/${assetPrefix}` : ""}`;
        if (assetPrefix.startsWith("http")) {
            url = `${protocol}://${assetPrefix.split("://")[1]}`;
        }
        source = new window.WebSocket(`${url}${options.path}`);
        source.onopen = handleOnline;
        source.onerror = handleDisconnect;
        source.onmessage = handleMessage;
    }
    init();
}
}}),
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_esm__({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
var __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[turbopack]/browser/dev/hmr-client/websocket.ts [client] (ecmascript)");
;
function connect({ // TODO(WEB-1465) Remove this backwards compat fallback once
// vercel/next.js#54586 is merged.
addMessageListener = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["addMessageListener"], // TODO(WEB-1465) Remove this backwards compat fallback once
// vercel/next.js#54586 is merged.
sendMessage = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendMessage"], onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    // TODO(WEB-1465) Remove this backwards compat fallback once
    // vercel/next.js#54586 is merged.
    if (callback === undefined) {
        callback = sendMessage;
        sendMessage = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendMessage"];
    }
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/src/pages/Registrierung.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [client] (ecmascript)");
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#F1F1F1] p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden relative max-w-[1300px] h-[800px] mx-auto mt-2 md:mt-[20px] lg:mb-[160px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-[5px] left-[5px] md:top-[12px] md:left-[58px] z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "160",
                            height: "79",
                            viewBox: "0 0 160 79",
                            fill: "none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    "clip-path": "url(#clip0_654_1634)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M130.591 10.5035C133.902 8.76016 137.788 7.8929 142.253 7.8929C144.951 7.8929 147.486 8.15571 149.885 8.69008C152.272 9.2376 155.596 10.4027 158.715 11.7474V3.43392C153.508 1.51542 147.999 0.560547 142.175 0.560547C136.35 0.560547 131.038 1.75632 126.525 4.1435C122.002 6.53943 118.507 9.90338 116.028 14.2616C113.563 18.6067 112.318 23.6395 112.318 29.3293C112.318 35.0191 113.563 40.2577 116.028 44.7167C118.507 49.1757 121.989 52.6229 126.481 55.0714C130.968 57.5111 136.157 58.7332 142.017 58.7332C145.67 58.7332 148.986 58.3915 151.943 57.7301C154.035 57.2527 156.285 56.508 158.715 55.4831V46.9725C155.697 48.6369 152.934 49.7889 150.412 50.4284C147.877 51.0767 145.056 51.3964 141.938 51.3964C137.744 51.3964 134.012 50.5423 130.766 48.8165C127.511 47.0951 124.963 44.5853 123.134 41.2871C121.305 37.9801 120.393 33.9854 120.393 29.3205C120.393 24.9185 121.261 21.1078 123.007 17.9147C124.753 14.7215 127.292 12.2468 130.591 10.4991V10.5035Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 13,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0 64.1953H5.58364C6.5179 64.1953 7.37321 64.3837 8.14518 64.756C8.91716 65.1283 9.53123 65.6539 9.97862 66.3241C10.426 66.9986 10.6497 67.752 10.6497 68.593C10.6497 69.434 10.426 70.1873 9.97862 70.8619C9.53123 71.5364 8.92154 72.0577 8.14518 72.43C7.37321 72.8023 6.5179 72.9906 5.58364 72.9906H1.56149V77.927H0V64.1953ZM5.30292 71.5101C6.43895 71.5101 7.34689 71.2517 8.03553 70.7305C8.72416 70.2092 9.06629 69.4997 9.06629 68.593C9.06629 67.6863 8.72416 66.9723 8.03553 66.4555C7.34689 65.9342 6.43895 65.6758 5.30292 65.6758H1.56149V71.5145H5.30292V71.5101Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 14,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M15.593 67.9621C16.2991 67.5548 17.1281 67.3533 18.0756 67.3533V68.6936C17.3036 68.6936 16.6106 68.8425 16.0053 69.1316C15.4 69.4251 14.9263 69.8368 14.5841 70.3624C14.242 70.888 14.0753 71.4837 14.0753 72.1495V77.9269H12.5753V67.5942H14.0753V69.6134C14.3824 68.9214 14.8912 68.3695 15.5974 67.9621H15.593Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 15,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M19.7862 65.4129C19.5932 65.2115 19.4967 64.9793 19.4967 64.7121C19.4967 64.4449 19.5932 64.2172 19.7862 64.0244C19.9792 63.8317 20.216 63.7354 20.4968 63.7354C20.7775 63.7354 20.9924 63.8317 21.1854 64.0244C21.3784 64.2172 21.4749 64.4493 21.4749 64.7121C21.4749 64.9749 21.3784 65.2115 21.1854 65.4129C20.9924 65.6144 20.7599 65.7108 20.4968 65.7108C20.216 65.7108 19.9792 65.6101 19.7862 65.4129ZM19.7379 67.5943H21.238V77.927H19.7379V67.5943Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 16,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M36.9538 67.8614C37.5152 68.203 37.9495 68.6761 38.2653 69.2805C38.5767 69.885 38.7346 70.5771 38.7346 71.348V77.9269H37.2345V71.5495C37.2345 70.7085 37.0108 70.0252 36.5634 69.4908C36.116 68.9564 35.5458 68.6892 34.8528 68.6892C34.0238 68.6892 33.3527 68.9389 32.8308 69.4382C32.3088 69.9376 32.05 70.5727 32.05 71.348V77.9269H30.5499V71.5495C30.5499 70.7085 30.3262 70.0252 29.8788 69.4908C29.4315 68.9564 28.8612 68.6892 28.1682 68.6892C27.3392 68.6892 26.6681 68.9389 26.1462 69.4382C25.6242 69.9376 25.3654 70.5727 25.3654 71.348V77.9269H23.8654V67.5942H25.3654V69.1141C25.633 68.5666 26.0278 68.1373 26.5585 67.8263C27.0848 67.5154 27.6901 67.3577 28.37 67.3577C29.142 67.3577 29.8262 67.5548 30.414 67.949C31.0017 68.3432 31.4359 68.8776 31.7167 69.5565C31.9316 68.8907 32.3439 68.3563 32.958 67.9577C33.572 67.5592 34.2738 67.3577 35.059 67.3577C35.7651 67.3577 36.4011 67.5285 36.9626 67.8658L36.9538 67.8614Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 17,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M47.8929 76.4683C48.5114 76.2274 48.9851 75.934 49.3053 75.5879L50.2264 76.5691C49.7878 77.0509 49.1693 77.4363 48.3754 77.7298C47.5815 78.0233 46.8095 78.1678 46.0639 78.1678C45.1428 78.1678 44.2831 77.9357 43.4804 77.467C42.6777 77.0027 42.0374 76.3501 41.5505 75.5178C41.0636 74.6856 40.818 73.757 40.818 72.7277C40.818 71.6984 41.0461 70.8136 41.5066 69.9901C41.9672 69.1623 42.5856 68.5184 43.3664 68.0497C44.1471 67.5854 44.998 67.3489 45.9192 67.3489C47.4675 67.3489 48.6737 67.8876 49.5334 68.9695C50.3931 70.047 50.8229 71.5013 50.8229 73.3278H42.3576C42.4628 74.3527 42.8532 75.1937 43.5287 75.8463C44.2041 76.499 45.0419 76.8275 46.042 76.8275C46.656 76.8275 47.2745 76.7092 47.8929 76.4683ZM43.5769 69.6003C42.9102 70.2047 42.5111 71.0019 42.3751 71.9874H49.3404C49.2351 71.0019 48.893 70.2047 48.3184 69.6003C47.7438 68.9958 46.9631 68.6892 45.9762 68.6892C45.0419 68.6892 44.2392 68.9914 43.5725 69.6003H43.5769Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 18,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M69.5828 64.1953V77.927H68.0213V71.6722H59.9156V77.927H58.3541V64.1953H59.9156V70.1917H68.0213V64.1953H69.5828Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 19,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M74.4252 77.4276C73.5962 76.9326 72.9382 76.2712 72.4514 75.439C71.9645 74.6068 71.7189 73.7088 71.7189 72.7496C71.7189 71.7903 71.9601 70.8968 72.4514 70.0689C72.9382 69.2411 73.5962 68.5841 74.4252 68.0891C75.2542 67.5942 76.1402 67.3489 77.0876 67.3489C78.035 67.3489 78.921 67.5942 79.7412 68.0891C80.5615 68.5841 81.215 69.2411 81.7019 70.0689C82.1887 70.8968 82.4344 71.786 82.4344 72.7496C82.4344 73.7132 82.1887 74.6068 81.7019 75.439C81.215 76.2712 80.5615 76.937 79.7412 77.4276C78.921 77.9225 78.035 78.1678 77.0876 78.1678C76.1402 78.1678 75.2542 77.9225 74.4252 77.4276ZM78.9605 76.2668C79.5395 75.8945 80 75.3952 80.3422 74.7776C80.6843 74.16 80.851 73.4811 80.851 72.7496C80.851 72.0181 80.6799 71.3567 80.3422 70.7303C80 70.104 79.5395 69.609 78.9605 69.2411C78.3815 68.8732 77.7543 68.6892 77.0876 68.6892C76.4209 68.6892 75.7761 68.8732 75.1971 69.2411C74.6182 69.609 74.1576 70.104 73.8155 70.7303C73.4734 71.3567 73.3067 72.0312 73.3067 72.7496C73.3067 73.4679 73.4777 74.16 73.8155 74.7776C74.1576 75.3952 74.6182 75.8945 75.1971 76.2668C75.7761 76.6391 76.4077 76.8275 77.0876 76.8275C77.7675 76.8275 78.3771 76.6391 78.9605 76.2668Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 20,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M97.6063 67.8614C98.1677 68.203 98.6019 68.6761 98.9177 69.2805C99.2292 69.885 99.3871 70.5771 99.3871 71.348V77.9269H97.887V71.5495C97.887 70.7085 97.6633 70.0252 97.2159 69.4908C96.7685 68.9564 96.1983 68.6892 95.5053 68.6892C94.6763 68.6892 94.0052 68.9389 93.4832 69.4382C92.9613 69.9376 92.7025 70.5727 92.7025 71.348V77.9269H91.2024V71.5495C91.2024 70.7085 90.9787 70.0252 90.5313 69.4908C90.0839 68.9564 89.5137 68.6892 88.8207 68.6892C87.9917 68.6892 87.3206 68.9389 86.7986 69.4382C86.2767 69.9376 86.0179 70.5727 86.0179 71.348V77.9269H84.5178V67.5942H86.0179V69.1141C86.2855 68.5666 86.6802 68.1373 87.211 67.8263C87.7373 67.5154 88.3426 67.3577 89.0225 67.3577C89.7944 67.3577 90.4787 67.5548 91.0664 67.949C91.6542 68.3432 92.0884 68.8776 92.3691 69.5565C92.5841 68.8907 92.9964 68.3563 93.6104 67.9577C94.2245 67.5592 94.9263 67.3577 95.7114 67.3577C96.4176 67.3577 97.0536 67.5285 97.615 67.8658L97.6063 67.8614Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 21,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M108.545 76.4683C109.164 76.2274 109.638 75.934 109.958 75.5879L110.879 76.5691C110.44 77.0509 109.822 77.4363 109.028 77.7298C108.234 78.0233 107.462 78.1678 106.716 78.1678C105.795 78.1678 104.936 77.9357 104.133 77.467C103.33 77.0027 102.69 76.3501 102.203 75.5178C101.716 74.6856 101.47 73.757 101.47 72.7277C101.47 71.6984 101.699 70.8136 102.159 69.9901C102.62 69.1623 103.238 68.5184 104.019 68.0497C104.8 67.5854 105.651 67.3489 106.572 67.3489C108.12 67.3489 109.326 67.8876 110.186 68.9695C111.046 70.047 111.475 71.5013 111.475 73.3278H103.01C103.115 74.3527 103.506 75.1937 104.181 75.8463C104.857 76.499 105.694 76.8275 106.694 76.8275C107.308 76.8275 107.927 76.7092 108.545 76.4683ZM104.234 69.6003C103.567 70.2047 103.168 71.0019 103.032 71.9874H109.997C109.892 71.0019 109.55 70.2047 108.975 69.6003C108.401 68.9958 107.62 68.6892 106.633 68.6892C105.699 68.6892 104.896 68.9914 104.229 69.6003H104.234Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 22,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M122.015 77.1999C120.928 76.5516 120.064 75.6844 119.423 74.5893C118.783 73.4987 118.463 72.316 118.463 71.0502C118.463 69.7843 118.783 68.6104 119.423 67.5198C120.064 66.4335 120.928 65.5662 122.015 64.9224C123.103 64.2741 124.266 63.9543 125.507 63.9543C126.441 63.9543 127.336 64.1383 128.191 64.5019C129.047 64.8698 129.801 65.3867 130.455 66.0524L129.393 67.1299C128.884 66.5824 128.297 66.1576 127.621 65.8509C126.946 65.5443 126.244 65.391 125.511 65.391C124.538 65.391 123.634 65.6495 122.801 66.1619C121.967 66.6744 121.301 67.3665 120.801 68.2425C120.3 69.1142 120.05 70.0515 120.05 71.0502C120.05 72.0488 120.3 73.0037 120.801 73.871C121.301 74.7382 121.967 75.4303 122.801 75.9515C123.634 76.4728 124.538 76.7312 125.511 76.7312C126.244 76.7312 126.95 76.5779 127.621 76.2713C128.297 75.9647 128.884 75.5398 129.393 74.9923L130.455 76.0698C129.801 76.7224 129.047 77.2349 128.191 77.6072C127.336 77.9795 126.441 78.1679 125.507 78.1679C124.266 78.1679 123.103 77.8438 122.015 77.1999Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 23,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M139.494 68.5228C140.209 69.3024 140.565 70.3405 140.565 71.6327V77.9313H139.065V76.3107C138.705 76.8976 138.187 77.3531 137.512 77.6817C136.836 78.0102 136.139 78.1722 135.42 78.1722C134.31 78.1722 133.406 77.8744 132.696 77.2743C131.99 76.6742 131.634 75.877 131.634 74.874C131.634 74.2082 131.819 73.6125 132.183 73.0869C132.551 72.5613 133.042 72.1539 133.665 71.8692C134.284 71.5845 134.964 71.44 135.696 71.44C136.736 71.44 137.858 71.6327 139.06 72.0181V71.6371C139.06 70.7961 138.845 70.0865 138.42 69.5083C137.994 68.9301 137.271 68.6367 136.257 68.6367C135.788 68.6367 135.314 68.7199 134.828 68.8863C134.341 69.0528 133.81 69.2849 133.235 69.574L132.634 68.3563C133.968 67.6906 135.209 67.3577 136.358 67.3577C137.731 67.3577 138.775 67.7475 139.49 68.5272L139.494 68.5228ZM137.793 76.28C138.455 75.8989 138.876 75.3689 139.065 74.69V73.1088C138.051 72.8285 137.008 72.6883 135.942 72.6883C135.152 72.6883 134.485 72.8898 133.928 73.2884C133.376 73.687 133.099 74.1951 133.099 74.8083C133.099 75.4215 133.341 75.9296 133.832 76.2975C134.319 76.6655 134.937 76.8494 135.683 76.8494C136.429 76.8494 137.135 76.6611 137.793 76.28Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 24,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M146.39 67.9621C147.096 67.5548 147.925 67.3533 148.872 67.3533V68.6936C148.1 68.6936 147.407 68.8425 146.802 69.1316C146.197 69.4251 145.723 69.8368 145.381 70.3624C145.039 70.888 144.872 71.4837 144.872 72.1495V77.9269H143.372V67.5942H144.872V69.6134C145.179 68.9214 145.688 68.3695 146.394 67.9621H146.39Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 25,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M157.07 76.4683C157.689 76.2274 158.162 75.934 158.482 75.5879L159.404 76.5691C158.965 77.0509 158.346 77.4363 157.553 77.7298C156.759 78.0233 155.987 78.1678 155.241 78.1678C154.32 78.1678 153.46 77.9357 152.658 77.467C151.855 77.0027 151.214 76.3501 150.728 75.5178C150.241 74.6856 149.995 73.757 149.995 72.7277C149.995 71.6984 150.223 70.8136 150.684 69.9901C151.144 69.1623 151.763 68.5184 152.544 68.0497C153.324 67.5854 154.175 67.3489 155.096 67.3489C156.645 67.3489 157.851 67.8876 158.711 68.9695C159.57 70.047 160 71.5013 160 73.3278H151.535C151.64 74.3527 152.03 75.1937 152.706 75.8463C153.381 76.499 154.219 76.8275 155.219 76.8275C155.833 76.8275 156.452 76.7092 157.07 76.4683ZM152.754 69.6003C152.087 70.2047 151.688 71.0019 151.552 71.9874H158.518C158.412 71.0019 158.07 70.2047 157.496 69.6003C156.921 68.9958 156.14 68.6892 155.153 68.6892C154.219 68.6892 153.416 68.9914 152.75 69.6003H152.754Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 26,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M40.4584 8.87416C38.6995 6.02269 36.2652 3.83262 33.1378 2.30395C30.006 0.762144 26.4006 0 22.2863 0H0.64917V57.4893H8.55311V37.4502H22.2819C26.3918 37.4502 30.028 36.688 33.1773 35.1594C36.3309 33.6176 38.7609 31.4538 40.4891 28.6242C42.226 25.8078 43.0813 22.5095 43.0813 18.7338C43.0813 14.9582 42.1997 11.7169 40.454 8.87854L40.4584 8.87416ZM23.6767 30.4901H8.55311V7.04764H23.6767C30.1639 7.04764 35.4055 12.295 35.4055 18.7733C35.4055 25.2515 30.1639 30.4858 23.6767 30.4858V30.4901Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 27,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M93.8648 0V57.4893H101.769V0H93.8648ZM52.1696 0V57.4893H60.0735V0H52.1696Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 28,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M108.69 33.6308L77.1709 20.8364C77.0393 20.7882 76.8946 20.7882 76.7674 20.8364L45.2481 33.6308C44.9542 33.7403 44.8051 34.0644 44.9147 34.3579L46.156 37.7613C46.2657 38.0591 46.599 38.2124 46.8973 38.0986L76.7718 28.7075C76.9033 28.6594 77.0481 28.6594 77.1753 28.7075L107.05 38.0986C107.348 38.2124 107.681 38.0591 107.791 37.7613L109.032 34.3579C109.138 34.0644 108.988 33.7403 108.699 33.6308H108.69Z",
                                            fill: "#B99B5F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 29,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 12,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                        id: "clip0_654_1634",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            width: "160",
                                            height: "78.1679",
                                            fill: "white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 33,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 32,
                                        columnNumber: 5
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 31,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 11,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 10,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 left-0 w-full h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/Landing Page 2 (1).png",
                            alt: "Hero Image",
                            className: "object-cover w-full h-full"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 41,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 40,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-[26%] right-[8%] flex flex-col items-start text-[#F1F1F1]",
                        style: {
                            width: "587px",
                            height: "449px",
                            flexShrink: "0"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-6 flex items-start px-[10px] py-[4px] text-[20px] font-normal leading-[25.6px] text-[#F1F1F1] font-metropolis",
                                style: {
                                    display: "flex",
                                    padding: "4px 70px 4px 10px",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    borderRadius: "50px 0px 0px 50px",
                                    background: "linear-gradient(93deg, #B99B5F 0%, rgba(185, 155, 95, 0.00) 100%)",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "25.6px"
                                },
                                children: "Ab Frühsommer 2025"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 58,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mb-1 font-metropolis font-[600] text-[#F1F1F1]",
                                style: {
                                    fontSize: "65px",
                                    fontWeight: "600",
                                    lineHeight: "52px"
                                },
                                children: [
                                    "Stundenweise ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 85,
                                        columnNumber: 16
                                    }, this),
                                    "Betreuung",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 86,
                                        columnNumber: 12
                                    }, this),
                                    " durch Prime ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 87,
                                        columnNumber: 9
                                    }, this),
                                    " Home Care AG"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 77,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-metropolis font-normal text-[#F1F1F1]",
                                style: {
                                    fontSize: "20px",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "25.6px"
                                },
                                children: [
                                    "Flexible Betreuung –  Ihre Unterstützung genau wie",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 101,
                                        columnNumber: 51
                                    }, this),
                                    " Sie sie brauchen!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 92,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/Registrierung-Form1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "px-[20px] py-[10px] text-[18px] font-[500] leading-[21.6px] rounded-[50px] bg-[#B99B5F] mt-2",
                                    children: "Einfach, digital und individuell – Ihr Zuhause, unsere Fürsorge."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 107,
                                    columnNumber: 5
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 106,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 49,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 8,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:hidden block relative h-[800px] mx-auto mt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 left-0 right-0 flex justify-center items-center z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "131",
                            height: "64",
                            viewBox: "0 0 131 64",
                            fill: "none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    "clip-path": "url(#clip0_431_1657)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M106.921 8.59974C109.632 7.17242 112.814 6.46235 116.47 6.46235C118.679 6.46235 120.754 6.67752 122.719 7.11504C124.672 7.56332 127.394 8.51726 129.948 9.61824V2.81156C125.685 1.24078 121.174 0.458984 116.405 0.458984C111.636 0.458984 107.287 1.43803 103.592 3.39253C99.8893 5.3542 97.0271 8.10843 94.9981 11.6767C92.9799 15.2343 91.96 19.3549 91.96 24.0134C91.96 28.6719 92.9799 32.9611 94.9981 36.6118C97.0271 40.2626 99.8786 43.085 103.556 45.0897C107.23 47.0872 111.478 48.0878 116.276 48.0878C119.267 48.0878 121.982 47.8081 124.403 47.2666C126.116 46.8757 127.958 46.266 129.948 45.4268V38.4588C127.477 39.8215 125.215 40.7647 123.15 41.2883C121.074 41.8191 118.765 42.0809 116.211 42.0809C112.778 42.0809 109.722 41.3815 107.065 39.9686C104.4 38.5592 102.313 36.5043 100.816 33.8038C99.3183 31.0962 98.5714 27.8256 98.5714 24.0062C98.5714 20.4021 99.2824 17.282 100.712 14.6677C102.141 12.0533 104.22 10.0271 106.921 8.59616V8.59974Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 121,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0 52.5598H4.5716C5.33653 52.5598 6.03682 52.714 6.66887 53.0189C7.30092 53.3237 7.80369 53.754 8.16999 54.3027C8.5363 54.855 8.71945 55.4718 8.71945 56.1604C8.71945 56.849 8.5363 57.4658 8.16999 58.0181C7.80369 58.5703 7.30451 58.9971 6.66887 59.3019C6.03682 59.6068 5.33653 59.761 4.5716 59.761H1.27847V63.8027H0V52.5598ZM4.34177 58.5488C5.27189 58.5488 6.01527 58.3372 6.57909 57.9105C7.14291 57.4837 7.42302 56.9028 7.42302 56.1604C7.42302 55.418 7.14291 54.8335 6.57909 54.4103C6.01527 53.9836 5.27189 53.772 4.34177 53.772H1.27847V58.5524H4.34177V58.5488Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 122,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12.7666 55.644C13.3448 55.3105 14.0236 55.1455 14.7993 55.1455V56.2429C14.1672 56.2429 13.5998 56.3648 13.1042 56.6015C12.6086 56.8418 12.2208 57.1789 11.9407 57.6093C11.6606 58.0396 11.5241 58.5273 11.5241 59.0724V63.8027H10.2959V55.3428H11.5241V56.996C11.7755 56.4294 12.1921 55.9775 12.7702 55.644H12.7666Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 123,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M16.1999 53.5569C16.0419 53.3919 15.9629 53.2018 15.9629 52.9831C15.9629 52.7643 16.0419 52.5778 16.1999 52.42C16.3579 52.2622 16.5518 52.1833 16.7817 52.1833C17.0115 52.1833 17.1875 52.2622 17.3455 52.42C17.5035 52.5778 17.5825 52.7679 17.5825 52.9831C17.5825 53.1983 17.5035 53.3919 17.3455 53.5569C17.1875 53.7218 16.9972 53.8007 16.7817 53.8007C16.5518 53.8007 16.3579 53.7183 16.1999 53.5569ZM16.1604 55.3428H17.3886V63.8028H16.1604V55.3428Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 124,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M30.2557 55.5616C30.7154 55.8413 31.0709 56.2286 31.3295 56.7235C31.5845 57.2184 31.7137 57.7851 31.7137 58.4162V63.8028H30.4855V58.5812C30.4855 57.8926 30.3024 57.3332 29.9361 56.8957C29.5698 56.4581 29.1029 56.2394 28.5355 56.2394C27.8568 56.2394 27.3073 56.4438 26.88 56.8526C26.4526 57.2615 26.2407 57.7815 26.2407 58.4162V63.8028H25.0125V58.5812C25.0125 57.8926 24.8294 57.3332 24.4631 56.8957C24.0968 56.4581 23.6299 56.2394 23.0625 56.2394C22.3838 56.2394 21.8343 56.4438 21.407 56.8526C20.9796 57.2615 20.7677 57.7815 20.7677 58.4162V63.8028H19.5396V55.3428H20.7677V56.5872C20.9868 56.139 21.31 55.7875 21.7446 55.5329C22.1755 55.2783 22.6711 55.1492 23.2277 55.1492C23.8598 55.1492 24.42 55.3106 24.9012 55.6333C25.3824 55.9561 25.738 56.3936 25.9678 56.9495C26.1438 56.4044 26.4814 55.9668 26.9841 55.6405C27.4869 55.3141 28.0615 55.1492 28.7043 55.1492C29.2825 55.1492 29.8032 55.289 30.2629 55.5652L30.2557 55.5616Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 125,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M39.2125 62.6086C39.7189 62.4114 40.1067 62.1711 40.3689 61.8878L41.1231 62.6911C40.7639 63.0856 40.2576 63.4012 39.6076 63.6415C38.9576 63.8818 38.3255 64.0001 37.715 64.0001C36.9609 64.0001 36.257 63.81 35.5998 63.4263C34.9426 63.0462 34.4183 62.5118 34.0197 61.8304C33.621 61.149 33.4199 60.3888 33.4199 59.546C33.4199 58.7032 33.6067 57.9788 33.9837 57.3046C34.3608 56.6268 34.8672 56.0996 35.5064 55.7159C36.1456 55.3357 36.8423 55.1421 37.5965 55.1421C38.8642 55.1421 39.8518 55.5832 40.5556 56.469C41.2595 57.3512 41.6115 58.5418 41.6115 60.0373H34.6804C34.7666 60.8765 35.0862 61.565 35.6393 62.0994C36.1923 62.6337 36.8783 62.9027 37.697 62.9027C38.1998 62.9027 38.7062 62.8059 39.2125 62.6086ZM35.6788 56.9854C35.1329 57.4803 34.8061 58.133 34.6948 58.9399H40.3976C40.3114 58.133 40.0313 57.4803 39.5609 56.9854C39.0904 56.4905 38.4512 56.2395 37.6432 56.2395C36.8783 56.2395 36.2211 56.4869 35.6752 56.9854H35.6788Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 126,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M56.9708 52.5598V63.8027H55.6924V58.6815H49.0558V63.8027H47.7773V52.5598H49.0558V57.4694H55.6924V52.5598H56.9708Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 127,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M60.9355 63.394C60.2568 62.9888 59.7181 62.4473 59.3195 61.7659C58.9208 61.0845 58.7197 60.3493 58.7197 59.5639C58.7197 58.7785 58.9172 58.0469 59.3195 57.3691C59.7181 56.6913 60.2568 56.1534 60.9355 55.7482C61.6142 55.3429 62.3397 55.1421 63.1154 55.1421C63.8911 55.1421 64.6165 55.3429 65.288 55.7482C65.9596 56.1534 66.4947 56.6913 66.8933 57.3691C67.2919 58.0469 67.493 58.7749 67.493 59.5639C67.493 60.3529 67.2919 61.0845 66.8933 61.7659C66.4947 62.4473 65.9596 62.9924 65.288 63.394C64.6165 63.7993 63.8911 64.0001 63.1154 64.0001C62.3397 64.0001 61.6142 63.7993 60.9355 63.394ZM64.6488 62.4437C65.1228 62.1388 65.4999 61.73 65.78 61.2244C66.0602 60.7187 66.1966 60.1628 66.1966 59.5639C66.1966 58.965 66.0566 58.4235 65.78 57.9107C65.4999 57.3978 65.1228 56.9926 64.6488 56.6913C64.1748 56.3901 63.6612 56.2395 63.1154 56.2395C62.5695 56.2395 62.0416 56.3901 61.5676 56.6913C61.0935 56.9926 60.7164 57.3978 60.4363 57.9107C60.1562 58.4235 60.0197 58.9758 60.0197 59.5639C60.0197 60.1521 60.1598 60.7187 60.4363 61.2244C60.7164 61.73 61.0935 62.1388 61.5676 62.4437C62.0416 62.7485 62.5587 62.9027 63.1154 62.9027C63.672 62.9027 64.1712 62.7485 64.6488 62.4437Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 128,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M79.9149 55.5616C80.3746 55.8413 80.7301 56.2286 80.9887 56.7235C81.2436 57.2184 81.3729 57.7851 81.3729 58.4162V63.8028H80.1447V58.5812C80.1447 57.8926 79.9616 57.3332 79.5953 56.8957C79.229 56.4581 78.7621 56.2394 78.1947 56.2394C77.516 56.2394 76.9665 56.4438 76.5392 56.8526C76.1118 57.2615 75.8999 57.7815 75.8999 58.4162V63.8028H74.6717V58.5812C74.6717 57.8926 74.4886 57.3332 74.1223 56.8957C73.756 56.4581 73.2891 56.2394 72.7217 56.2394C72.043 56.2394 71.4935 56.4438 71.0662 56.8526C70.6388 57.2615 70.4269 57.7815 70.4269 58.4162V63.8028H69.1987V55.3428H70.4269V56.5872C70.646 56.139 70.9692 55.7875 71.4037 55.5329C71.8347 55.2783 72.3303 55.1492 72.8869 55.1492C73.519 55.1492 74.0792 55.3106 74.5604 55.6333C75.0416 55.9561 75.3971 56.3936 75.627 56.9495C75.803 56.4044 76.1405 55.9668 76.6433 55.6405C77.1461 55.3141 77.7207 55.1492 78.3635 55.1492C78.9417 55.1492 79.4624 55.289 79.9221 55.5652L79.9149 55.5616Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 129,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M88.8717 62.6086C89.3781 62.4114 89.7659 62.1711 90.0281 61.8878L90.7822 62.6911C90.4231 63.0856 89.9168 63.4012 89.2668 63.6415C88.6167 63.8818 87.9847 64.0001 87.3742 64.0001C86.62 64.0001 85.9162 63.81 85.259 63.4263C84.6018 63.0462 84.0775 62.5118 83.6788 61.8304C83.2802 61.149 83.0791 60.3888 83.0791 59.546C83.0791 58.7032 83.2658 57.9788 83.6429 57.3046C84.02 56.6268 84.5264 56.0996 85.1656 55.7159C85.8048 55.3357 86.5015 55.1421 87.2557 55.1421C88.5234 55.1421 89.511 55.5832 90.2148 56.469C90.9187 57.3512 91.2706 58.5418 91.2706 60.0373H84.3396C84.4258 60.8765 84.7454 61.565 85.2985 62.0994C85.8515 62.6337 86.5374 62.9027 87.3562 62.9027C87.859 62.9027 88.3654 62.8059 88.8717 62.6086ZM85.3416 56.9854C84.7957 57.4803 84.4689 58.133 84.3576 58.9399H90.0604C89.9742 58.133 89.6941 57.4803 89.2237 56.9854C88.7532 56.4905 88.114 56.2395 87.306 56.2395C86.541 56.2395 85.8838 56.4869 85.338 56.9854H85.3416Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 130,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M99.9001 63.2073C99.0095 62.6766 98.302 61.9665 97.7777 61.0699C97.2534 60.177 96.9912 59.2087 96.9912 58.1723C96.9912 57.1358 97.2534 56.1747 97.7777 55.2817C98.302 54.3924 99.0095 53.6823 99.9001 53.1551C100.791 52.6243 101.742 52.3625 102.759 52.3625C103.524 52.3625 104.256 52.5132 104.957 52.8108C105.657 53.1121 106.274 53.5353 106.81 54.0804L105.941 54.9626C105.524 54.5143 105.043 54.1664 104.49 53.9154C103.937 53.6644 103.362 53.5388 102.762 53.5388C101.965 53.5388 101.225 53.7504 100.543 54.17C99.8606 54.5896 99.3147 55.1562 98.9053 55.8735C98.4959 56.5871 98.2912 57.3546 98.2912 58.1723C98.2912 58.9899 98.4959 59.7717 98.9053 60.4818C99.3147 61.1919 99.8606 61.7585 100.543 62.1853C101.225 62.612 101.965 62.8236 102.762 62.8236C103.362 62.8236 103.94 62.6981 104.49 62.4471C105.043 62.196 105.524 61.8482 105.941 61.3999L106.81 62.2821C106.274 62.8164 105.657 63.236 104.957 63.5409C104.256 63.8457 103.524 63.9999 102.759 63.9999C101.742 63.9999 100.791 63.7345 99.9001 63.2073Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 131,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M114.211 56.1031C114.797 56.7415 115.088 57.5914 115.088 58.6493V63.8063H113.859V62.4794C113.565 62.96 113.141 63.333 112.588 63.6019C112.035 63.8709 111.464 64.0036 110.875 64.0036C109.967 64.0036 109.227 63.7597 108.645 63.2684C108.067 62.7771 107.776 62.1244 107.776 61.3032C107.776 60.758 107.927 60.2703 108.225 59.84C108.526 59.4096 108.929 59.0761 109.439 58.843C109.945 58.6099 110.502 58.4915 111.101 58.4915C111.952 58.4915 112.872 58.6493 113.856 58.9649V58.6529C113.856 57.9644 113.68 57.3834 113.331 56.91C112.983 56.4366 112.391 56.1964 111.561 56.1964C111.177 56.1964 110.789 56.2645 110.39 56.4008C109.992 56.537 109.557 56.7271 109.087 56.9638L108.595 55.9668C109.686 55.4217 110.703 55.1492 111.644 55.1492C112.768 55.1492 113.622 55.4683 114.208 56.1067L114.211 56.1031ZM112.818 62.4543C113.36 62.1423 113.705 61.7084 113.859 61.1525V59.8579C113.03 59.6284 112.175 59.5136 111.302 59.5136C110.656 59.5136 110.11 59.6786 109.654 60.0049C109.202 60.3313 108.975 60.7473 108.975 61.2494C108.975 61.7514 109.173 62.1674 109.575 62.4687C109.974 62.7699 110.48 62.9205 111.091 62.9205C111.701 62.9205 112.279 62.7663 112.818 62.4543Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 132,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M119.856 55.644C120.435 55.3105 121.113 55.1455 121.889 55.1455V56.2429C121.257 56.2429 120.69 56.3648 120.194 56.6015C119.698 56.8418 119.311 57.1789 119.031 57.6093C118.75 58.0396 118.614 58.5273 118.614 59.0724V63.8027H117.386V55.3428H118.614V56.996C118.865 56.4294 119.282 55.9775 119.86 55.644H119.856Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 133,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M128.601 62.6086C129.108 62.4114 129.495 62.1711 129.758 61.8878L130.512 62.6911C130.153 63.0856 129.646 63.4012 128.996 63.6415C128.346 63.8818 127.714 64.0001 127.104 64.0001C126.35 64.0001 125.646 63.81 124.988 63.4263C124.331 63.0462 123.807 62.5118 123.408 61.8304C123.01 61.149 122.809 60.3888 122.809 59.546C122.809 58.7032 122.995 57.9788 123.372 57.3046C123.749 56.6268 124.256 56.0996 124.895 55.7159C125.534 55.3357 126.231 55.1421 126.985 55.1421C128.253 55.1421 129.24 55.5832 129.944 56.469C130.648 57.3512 131 58.5418 131 60.0373H124.069C124.155 60.8765 124.475 61.565 125.028 62.0994C125.581 62.6337 126.267 62.9027 127.086 62.9027C127.588 62.9027 128.095 62.8059 128.601 62.6086ZM125.067 56.9854C124.522 57.4803 124.195 58.133 124.083 58.9399H129.786C129.7 58.133 129.42 57.4803 128.95 56.9854C128.479 56.4905 127.84 56.2395 127.032 56.2395C126.267 56.2395 125.61 56.4869 125.064 56.9854H125.067Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 134,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M33.1255 7.26572C31.6854 4.93108 29.6923 3.13796 27.1318 1.88636C24.5677 0.624005 21.6157 0 18.2472 0H0.531738V47.0694H7.00309V30.6623H18.2436C21.6085 30.6623 24.5856 30.0383 27.1641 28.7867C29.7462 27.5244 31.7357 25.7528 33.1507 23.4361C34.5728 21.1301 35.2731 18.4297 35.2731 15.3383C35.2731 12.247 34.5512 9.59319 33.1219 7.2693L33.1255 7.26572ZM19.3856 24.9638H7.00309V5.77026H19.3856C24.697 5.77026 28.9884 10.0666 28.9884 15.3706C28.9884 20.6747 24.697 24.9602 19.3856 24.9602V24.9638Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 135,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M76.8519 0V47.0694H83.3232V0H76.8519ZM42.7139 0V47.0694H49.1852V0H42.7139Z",
                                            fill: "#04436F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 136,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M88.9902 27.535L63.1838 17.0596C63.0761 17.0202 62.9576 17.0202 62.8535 17.0596L37.047 27.535C36.8064 27.6247 36.6843 27.8901 36.7741 28.1303L37.7904 30.9168C37.8802 31.1607 38.1531 31.2862 38.3973 31.193L62.857 23.5041C62.9648 23.4646 63.0833 23.4646 63.1874 23.5041L87.6471 31.193C87.8913 31.2862 88.1643 31.1607 88.2541 30.9168L89.2704 28.1303C89.3566 27.8901 89.2345 27.6247 88.9974 27.535H88.9902Z",
                                            fill: "#B99B5F"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 137,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 120,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                        id: "clip0_431_1657",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            width: "131",
                                            height: "64",
                                            fill: "white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 141,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 140,
                                        columnNumber: 5
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 139,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 119,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 118,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute w-full md:w-auto h-[625px] mt-[80px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/Herosection new.png",
                            alt: "Hero Image",
                            className: "rounded-[20px] bg-[#F1F1F1]  md:w-[1000px] md:h-[725px]"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 149,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 148,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 w-full h-full flex flex-col justify-center items-center text-[#F1F1F1]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-[380px] text-center flex flex-col justify-center items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-[32px] w-[233px] px-2 py-1 text-[20px] font-[400] leading-[25.6px]  bg-custom-gradient",
                                    style: {
                                        borderRadius: "50px 0px 0px 50px",
                                        background: "linear-gradient(93deg, #B99B5F 0%, rgba(185, 155, 95, 0.00) 100%)"
                                    },
                                    children: "Ab Frühsommer 2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 158,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "lg:hidden block mb-[16px] text-[32px] leading-[32px] font-[600]",
                                    children: [
                                        "Stundenweise ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 169,
                                            columnNumber: 20
                                        }, this),
                                        " Betreuung durch ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 169,
                                            columnNumber: 46
                                        }, this),
                                        "Prime Home Care AG"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 168,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "lg:hidden block text-[20px] font-[400] leading-[17px] text-[#F1F1F1] px-2 ",
                                    children: [
                                        "Flexible Betreuung – Ihre Unterstützung,",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 173,
                                            columnNumber: 47
                                        }, this),
                                        " genau wann Sie sie brauchen!    "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 172,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/Registrierung-Form1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "font-metropolis flex flex-col items-center text-center font-metropolis text-[18px] font-[500] leading-[21.6px] rounded-[15px] mt-[32px] px-[20px] py-[12px] bg-[#B99B5F] transition-all duration-0",
                                        children: [
                                            "Einfach, digital und individuell – ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 179,
                                                columnNumber: 68
                                            }, this),
                                            "Ihr Zuhause, unsere Fürsorge."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 176,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 175,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 157,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 156,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 116,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden font-montserat rounded-[20px] max-w-[1290px] h-[360px] relative lg:flex flex-col items-center justify-center bg-cover mt-[100px] lg:mb-[160px]",
                style: {
                    backgroundImage: "url('/images/goldboxes.png')",
                    marginLeft: 'auto',
                    width: "100%",
                    maxWidth: "1270px",
                    minWidth: "1000px",
                    backgroundRepeat: 'no-repeat',
                    marginRight: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#B99B5F] font-metropolis font-semibold text-[44px] leading-[52.8px] text-center",
                        style: {
                            fontWeight: "600"
                        },
                        children: "Jetzt vormerken!"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 197,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[20px] leading-[25.6px] font-normal text-center mt-[12px]",
                        style: {
                            fontWeight: "400"
                        },
                        children: [
                            "Seien Sie unter den Ersten, die von unserer",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 213,
                                columnNumber: 48
                            }, this),
                            " innovativen Betreuung profitieren"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 207,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/Registrierung-Form1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-8 py-3 text-white font-metropolis text-[20px] font-medium leading-[21.6px] bg-[#B99B5F] rounded-full mt-[40px] ",
                            style: {
                                borderRadius: "50px"
                            },
                            children: "Klicken Sie hier, um sich unverbindlich zu registrieren und über den Start informiert zu werden!"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 218,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 217,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[16px] font-normal leading-[25.6px] text-center mt-[30px]",
                        style: {
                            fontWeight: "400",
                            fontFamily: 'Metropolis',
                            fontStyle: 'italic'
                        },
                        children: "(Frühbucher erhalten exklusive Angebote!)"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 229,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 186,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mb-[160px] font-montserat rounded-[20px] max-w-[1290px] px-2 py-4 bg-[rgba(185,155,95,0.07)] relative flex flex-col items-center justify-center bg-cover md:mt-[150px] mt-[50px] block lg:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#B99B5F] text-center text-[32px] font-[600] mb-2 mt-[4px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontSize: '32px',
                            fontWeight: '600',
                            lineHeight: '32px'
                        },
                        children: "Jetzt vormerken!"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 244,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-[16px] font-[400] mb-[32px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '25.6px'
                        },
                        children: "Seien Sie unter den Ersten, die von unserer innovativen Betreuung profitieren"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 258,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center px-4 mb-[32px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/Registrierung-Form1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "lg:py-[12px] lg:px-[30px] text-[18px] lg:text-[18px] font-[500] text-white bg-[#B99B5F] rounded-[10px] px-[15px] py-2 ",
                                style: {
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    lineHeight: '21.6px',
                                    color: '#FFF',
                                    textAlign: 'center',
                                    fontFamily: 'Metropolis',
                                    background: '#B99B5F',
                                    borderRadius: '10px'
                                },
                                children: [
                                    "Klicken Sie hier, um sich",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 287,
                                        columnNumber: 32
                                    }, this),
                                    " unverbindlich zu registrieren und",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 287,
                                        columnNumber: 75
                                    }, this),
                                    " über den Start informiert zu werden!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 274,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 273,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 272,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-[16px] font-[400] mb-[4px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontStyle: 'italic',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '25.6px'
                        },
                        children: "(Frühbucher erhalten exklusive Angebote!)  "
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 291,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 241,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden lg:flex items-center gap-[60px] bg-white rounded-[20px] lg:max-w-[1300px] mx-auto mt-[160px] mb-[160px]",
                style: {
                    height: "730px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 ",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/sectionhome.png",
                            alt: "Prime Home Care AG",
                            className: "rounded-[20px] object-cover h-full w-auto",
                            style: {
                                height: "100%",
                                width: "auto"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 314,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 313,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-left ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#B99B5F] font-metropolis font-semibold",
                                style: {
                                    fontSize: "54px",
                                    lineHeight: "70.5px",
                                    fontStyle: "normal",
                                    display: "flex",
                                    height: "40px",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    alignSelf: "stretch",
                                    marginBottom: "24px"
                                },
                                children: "Was macht uns besonders?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 328,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#B99B5F] font-metropolis font-normal",
                                style: {
                                    fontSize: "20px",
                                    lineHeight: "31px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontStyle: "normal",
                                    color: "#B99B5F",
                                    marginBottom: "40px",
                                    width: "100%",
                                    maxWidth: "804px",
                                    minWidth: "604px",
                                    height: "100%",
                                    maxHeight: "135px",
                                    minHeight: "250px"
                                },
                                children: [
                                    "Prime Home Care AG – Betreuung neu gedacht",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 367,
                                        columnNumber: 45
                                    }, this),
                                    "Unsere volldigitale Online-Plattform bietet Ihnen genau die Unterstützung, die Sie brauchen – stundenweise, flexibel und in bester Qualität. Egal, ob Sie Entlastung im Alltag suchen, Unterstützung für Ihre Liebsten oder einfach mehr Freiraum – wir sind für Sie da."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 348,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "font-metropolis",
                                style: {
                                    color: "#B99B5F",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "46.8px",
                                    listStyleType: "none",
                                    padding: "0",
                                    margin: "0"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            marginBottom: "30px",
                                            borderLeft: "2px solid #B99B5F"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "#B99B5F",
                                                    fontWeight: "700",
                                                    marginLeft: "30px" // Bold weight for strong text
                                                },
                                                children: "Flexibilität -"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 396,
                                                columnNumber: 5
                                            }, this),
                                            " ",
                                            "Stundenweise Betreuung nach Ihrem Zeitplan"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 389,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            marginBottom: "30px",
                                            borderLeft: "2px solid #B99B5F"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "#B99B5F",
                                                    fontWeight: "700",
                                                    marginLeft: "30px" // Bold weight for strong text
                                                },
                                                children: "Komfort -"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 414,
                                                columnNumber: 5
                                            }, this),
                                            " ",
                                            "Einfach online buchen und anpassen"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 407,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            borderLeft: "2px solid #B99B5F"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "#B99B5F",
                                                    fontWeight: "700",
                                                    marginLeft: "30px"
                                                },
                                                children: "Qualität -"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 431,
                                                columnNumber: 5
                                            }, this),
                                            " ",
                                            "Geprüfte, erfahrene Betreuungspersonen"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 426,
                                        columnNumber: 3
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 376,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 326,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 306,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:hidden block flex items-center mx-auto mt-[20px] mb-[160px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-[#B99B5F] font-metropolis font-semibold text-center",
                            style: {
                                fontSize: "32px",
                                lineHeight: "40px",
                                fontStyle: "normal",
                                display: "flex",
                                height: "40px",
                                flexDirection: "column",
                                justifyContent: "center",
                                flexShrink: 0,
                                alignSelf: "stretch",
                                marginBottom: "32px"
                            },
                            children: [
                                "Was macht uns ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 470,
                                    columnNumber: 17
                                }, this),
                                " besonders?"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 455,
                            columnNumber: 5
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[#B99B5F] font-metropolis font-normal text-center",
                            style: {
                                fontSize: "16px",
                                lineHeight: "20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontStyle: "normal",
                                color: "#B99B5F",
                                marginBottom: "32px"
                            },
                            children: [
                                "Prime Home Care AG – Betreuung neu gedacht. ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 489,
                                    columnNumber: 47
                                }, this),
                                "Unsere volldigitale Online-Plattform bietet Ihnen genau die Unterstützung, die Sie brauchen – stundenweise, flexibel und in bester Qualität. Egal, ob Sie Entlastung im Alltag suchen, Unterstützung für Ihre Liebsten oder einfach mehr Freiraum – wir sind für Sie da."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 475,
                            columnNumber: 5
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "font-metropolis ",
                            style: {
                                color: "#B99B5F",
                                fontSize: "24px",
                                fontStyle: "normal",
                                fontWeight: "400",
                                lineHeight: "24px",
                                listStyleType: "none",
                                padding: "0",
                                margin: "0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex flex-col",
                                    style: {
                                        marginBottom: "30px",
                                        borderLeft: "2px solid #B99B5F"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                color: "#B99B5F",
                                                fontWeight: "700",
                                                marginLeft: "16px" // Bold weight for strong text
                                            },
                                            children: "Flexibilität"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 518,
                                            columnNumber: 5
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "ml-[16px] text-[16px] text-[400]",
                                            children: "Stundenweise Betreuung nach Ihrem Zeitplan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 527,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 511,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex flex-col",
                                    style: {
                                        marginBottom: "30px",
                                        borderLeft: "2px solid #B99B5F"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                color: "#B99B5F",
                                                fontWeight: "700",
                                                marginLeft: "16px" // Bold weight for strong text
                                            },
                                            children: "Komfort"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 536,
                                            columnNumber: 5
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "ml-[16px] text-[16px] text-[400]",
                                            children: "Einfach online buchen und anpassen"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 545,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 529,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex flex-col",
                                    style: {
                                        borderLeft: "2px solid #B99B5F"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                color: "#B99B5F",
                                                fontWeight: "700",
                                                marginLeft: "16px" // Bold weight for strong text
                                            },
                                            children: "Qualität"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 553,
                                            columnNumber: 5
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "ml-[16px] text-[16px] text-[400]",
                                            children: "Geprüfte, erfahrene Betreuungspersonen"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 562,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 547,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 498,
                            columnNumber: 5
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Registrierung.js",
                    lineNumber: 453,
                    columnNumber: 3
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 448,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden lg:flex flex-col items-center gap-[60px] max-w-[1920px] px-[100px] mx-auto",
                style: {
                    width: "100%",
                    maxWidth: "1472px",
                    minWidth: "1000px",
                    height: "531px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#B99B5F] font-metropolis text-[55px] font-[600] leading-[71.5px]",
                                style: {
                                    marginBottom: "10px"
                                },
                                children: "Wer profitiert davon?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 578,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#B99B5F] font-metropolis text-[24px] font-normal leading-[40px]",
                                children: "Unsere Betreuung ist ideal für"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 586,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 577,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-[20px] w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center p-[4px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Link.png",
                                    alt: "Familien",
                                    className: "w-[352px] h-auto object-contain rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 597,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 596,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center p-[4px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Link (1).png",
                                    alt: "Senioren",
                                    className: "w-[352px] h-auto object-contain rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 606,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 605,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center p-[4px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Link (2).png",
                                    alt: "Berufstätige",
                                    className: "w-[352px] h-auto object-contain rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 616,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 615,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 594,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[24px] font-normal leading-[40px]",
                        children: "Wir bieten eine Lösung für jedes Bedürfnis – genau dann, wann Sie brauchen."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 625,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 569,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:hidden block flex flex-col items-center gap-[32px]  mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#B99B5F] font-metropolis text-[32px] font-[600] leading-[41.5px]",
                                children: "Wer profitiert davon?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 637,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#B99B5F] font-metropolis text-[16px] font-normal leading-[20px]",
                                children: "Unsere Betreuung ist ideal für:"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 643,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 636,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col justify-between gap-[50px] w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center py-[2px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Foto1.png",
                                    alt: "Familien",
                                    className: "w-full h-full object-cover rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 654,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 653,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center py-[2px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Foto2.png",
                                    alt: "Senioren",
                                    className: "w-full h-full object-cover rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 664,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 663,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center text-center py-[2px] rounded-[20px] ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/Foto3.png",
                                    alt: "Berufstätige",
                                    className: "w-full h-full object-cover rounded-[20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 674,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 673,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 651,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[16px] font-normal leading-[20px] text-center",
                        children: [
                            "Wir bieten eine Lösung für jedes Bedürfnis –",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 686,
                                columnNumber: 49
                            }, this),
                            " genau dann, wann Sie brauchen."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 683,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 632,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden lg:flex justify-between items-center lg:max-w-[1242px] mx-auto mt-[190px] mb-[190px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-[100px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/backphc.png",
                            alt: "Working with senior",
                            className: "w-[586px] h-[657px] object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 695,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 694,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:w-[563px] text-left mt-[100px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#FAFAFA] w-[499px] font-metropolis text-[32px] font-bold leading-[32px] mb-[16px] flex flex-col items-start px-[14px] py-[6px] rounded-[50px] bg-gradient-to-r from-[#B99B5F] to-[#B99B5F] bg-opacity-[0.51]",
                                style: {
                                    fontFamily: "Metropolis",
                                    lineHeight: "100%",
                                    background: "linear-gradient(100deg, #B99B5F 0%, rgba(185, 155, 95, 0.51) 100%)"
                                },
                                children: "In 3 einfachen Schritten zu Ihrer Betreuung"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 704,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#B99B5F] font-metropolis text-[48px] font-semibold leading-[71.5px] mb-[16px]",
                                style: {
                                    fontFamily: "Metropolis",
                                    fontSize: "48px",
                                    fontWeight: "600",
                                    lineHeight: "71.5px"
                                },
                                children: "So funktioniert's"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 716,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-[30px] text-[#1C1B1D] font-metropolis text-[20px] font-normal leading-[31px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-white text-[24px] text-[700] bg-[#B99B5F] rounded-[50px] px-[20px] py-[7px]",
                                                children: "Wunschzeit eingeben"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 731,
                                                columnNumber: 9
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 731,
                                                columnNumber: 139
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 ml-4 text-[24px] text-[500] text-[#B99B5F]",
                                                children: "Wählen Sie Datum, Uhrzeit, Dauer und Regelmässigkeit online aus"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 731,
                                                columnNumber: 149
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 730,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-white bg-[#B99B5F] text-[24px] text-[700] rounded-[50px] px-[20px] py-[7px]",
                                                children: "Betreuungsperson auswählen"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 734,
                                                columnNumber: 9
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 734,
                                                columnNumber: 146
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 ml-4 text-[24px] text-[500] text-[#B99B5F]",
                                                children: "Wir organisieren eine auf Ihre Bedürfnisse abgestimmte Betreuungsperson"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 734,
                                                columnNumber: 156
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 733,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-white bg-[#B99B5F] text-[24px] text-[700] rounded-[50px] px-[20px] py-[7px]",
                                                children: "Betreuung geniessen"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 737,
                                                columnNumber: 9
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 737,
                                                columnNumber: 139
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 ml-4 text-[24px] text-[500] text-[#B99B5F]",
                                                children: "Unser Team kümmert sich um den Rest – einfach, sicher und zuverlässig"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Registrierung.js",
                                                lineNumber: 737,
                                                columnNumber: 149
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 736,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 729,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#B99B5F] font-metropolis text-[24px] font-normal leading-[26px] mt-[60px] ml-3",
                                children: "Alles direkt über unsere benutzerfreundliche online Plattform."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 740,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 703,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 690,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:hidden block lg:flex justify-center items-center  mx-auto mt-[160px] mb-[160px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col lg:w-[563px] text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-[#FAFAFA] lg:w-[499px] px-[10px] py-[4px] font-metropolis text-[20px] font-[500] leading-[24px] mb-[16px] flex flex-col text-center rounded-[50px] bg-[#B99B5F]",
                            style: {
                                fontFamily: "Metropolis"
                            },
                            children: [
                                "In 3 einfachen Schritten",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 760,
                                    columnNumber: 27
                                }, this),
                                " zu Ihrer Betreuung:"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 754,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-[#B99B5F] font-metropolis text-[32px] font-semibold leading-[35px] mb-1",
                            style: {
                                fontFamily: "Metropolis",
                                fontWeight: "600"
                            },
                            children: "So funktioniert's"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 764,
                            columnNumber: 1
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phcback.png",
                                alt: "Working with senior",
                                className: "w-[387px] md:w-[730px] md:h-auto h-[198px] object-cover mb-[16px] mt-[12px] items-center flex justify-center "
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 776,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 775,
                            columnNumber: 2
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-6 text-[#1C1B1D]  text-left font-metropolis text-[20px] font-normal leading-[31px] gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "  block text-white text-[20px] leading-[21px] text-[700] bg-[#B99B5F] rounded-[5px] px-[16px] py-[10px] w-[331px]",
                                            children: "Wunschzeit eingeben"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 785,
                                            columnNumber: 9
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 785,
                                            columnNumber: 172
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-[-20px] text-[20px] leading-[24px] text-[400] text-[#B99B5F]",
                                            children: "Wählen Sie Datum, Uhrzeit, Dauer und Regelmässigkeit online aus."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 785,
                                            columnNumber: 182
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 784,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "block text-white bg-[#B99B5F] text-[20px] text-[700] leading-[21px] rounded-[5px] px-[16px] py-[10px] w-[331px]",
                                            children: "Betreuungsperson auswählen"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 789,
                                            columnNumber: 9
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 789,
                                            columnNumber: 177
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-[-20px] text-[20px] leading-[24px] text-[400] text-[#B99B5F]",
                                            children: "Wir organisieren eine auf Ihre Bedürfnisse abgestimmte Betreuungsperson."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 789,
                                            columnNumber: 187
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 788,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "block text-white bg-[#B99B5F] text-[20px] text-[700] leading-[21px] rounded-[5px] px-[16px] py-[10px] w-[331px]",
                                            children: "Betreuung geniessen"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 792,
                                            columnNumber: 9
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 792,
                                            columnNumber: 170
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-[-20px] text-[20px] leading-[24px] text-[400] text-[#B99B5F]",
                                            children: [
                                                "Unser Team kümmert sich um den Rest ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/pages/Registrierung.js",
                                                    lineNumber: 792,
                                                    columnNumber: 295
                                                }, this),
                                                " – einfach, sicher und zuverlässig."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 792,
                                            columnNumber: 180
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 791,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 783,
                            columnNumber: 5
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[#B99B5F] font-metropolis text-[16px] font-normal leading-[26px] mt-[50px] ml-2",
                            children: [
                                "Alles direkt über unsere",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 796,
                                    columnNumber: 29
                                }, this),
                                " benutzerfreundliche online Plattform."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 795,
                            columnNumber: 5
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Registrierung.js",
                    lineNumber: 753,
                    columnNumber: 3
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 747,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex justify-center items-center w-full mb-[160px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center lg:w-[1167px] lg:h-[552px] rounded-[20px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center lg:items-start lg:w-[50%] lg:pr-[20px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[#B99B5F] lg:text-left text-center font-metropolis text-[32px] lg:text-[55px] font-semibold leading-[40px] lg:leading-[71.5px] mb-[20px]",
                                    children: [
                                        "Unsere ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 811,
                                            columnNumber: 16
                                        }, this),
                                        "Betreuungs­personen"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 808,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[#B99B5F] font-metropolis text-[20px] font-[600] leading-[26px] lg:space-y-[14px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: "Vertrauen Sie den Profis"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 815,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: "Geprüft und qualifiziert"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 816,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: "Freundlich, erfahren und engagiert"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 817,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: "Flexibel und an Ihre Bedürfnisse angepasst"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 818,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "lg:block hidden bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: [
                                                "Ihre Bedürfnisse und Zufriedenheit stehen ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/pages/Registrierung.js",
                                                    lineNumber: 819,
                                                    columnNumber: 143
                                                }, this),
                                                " für uns an erster Stelle"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 819,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "lg:hidden block bg-white p-[20px] w-[370] md:w-[600px] rounded-[20px] mb-2",
                                            children: [
                                                "Ihre Bedürfnisse und",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/pages/Registrierung.js",
                                                    lineNumber: 820,
                                                    columnNumber: 121
                                                }, this),
                                                " Zufriedenheit stehen",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/pages/Registrierung.js",
                                                    lineNumber: 820,
                                                    columnNumber: 151
                                                }, this),
                                                "  für uns an erster Stelle"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 820,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 814,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 807,
                            columnNumber: 5
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:block hidden w-[42%] h-[552px] bg-lightgray rounded-[20px] max-w-[790px]",
                            style: {
                                backgroundImage: `url(/images/66501b5ca75a448031e5dcfa_hero-02.jpg.png)`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundColor: "#f0f0f0"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 825,
                            columnNumber: 3
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Registrierung.js",
                    lineNumber: 805,
                    columnNumber: 3
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 804,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:px-[50px] relative flex flex-col lg:flex-row justify-center items-center mb-[160px] w-full lg:max-w-[1167px] lg:gap-[100px] lg:flex-shrink-0 text-center mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:block hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "flex justify-center",
                            src: "/images/Web-Experience.png",
                            alt: "Warum Prime Home Care",
                            style: {
                                width: "467px",
                                height: "470px"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 843,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 842,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:hidden block",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "flex justify-center mb-[40px] rounded-[20px]",
                            src: "/images/Mobile-Experience 1.png",
                            alt: "Warum Prime Home Care",
                            style: {
                                width: "100%",
                                height: "100%"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 854,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 853,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        class: "lg:w-[60%] flex flex-col lg:justify-start lg:items-start text-left lg:mb-[120px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "lg:text-[55px] text-[32px] lg:leading-[71.5px] leading-[40px]",
                                style: {
                                    fontWeight: "600",
                                    color: "#B99B5F",
                                    marginBottom: "16px"
                                },
                                children: "Warum die Prime Home Care AG?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 865,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lg:block hidden ",
                                style: {
                                    fontSize: "20px",
                                    fontWeight: "400",
                                    lineHeight: "25.6px",
                                    color: "#B99B5F"
                                },
                                children: [
                                    "Wir sind die erste volldigitale Plattform in der Schweiz,",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 882,
                                        columnNumber: 64
                                    }, this),
                                    " die Betreuung so einfach und modern macht. Mit uns",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 882,
                                        columnNumber: 124
                                    }, this),
                                    " haben Sie die Kontrolle über Ihre Zeit – ohne ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 882,
                                        columnNumber: 180
                                    }, this),
                                    "Kompromisse bei Qualität und Sicherheit."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 874,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lg:hidden block ",
                                style: {
                                    fontSize: "20px",
                                    fontWeight: "400",
                                    lineHeight: "25.6px",
                                    color: "#B99B5F"
                                },
                                children: "Wir sind die erste volldigitale Plattform in der Schweiz, die Betreuung so einfach und modern macht. Mit uns haben Sie die Kontrolle über Ihre Zeit – ohne Kompromisse bei Qualität und Sicherheit."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 885,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bg-[#B99B5F] mt-[16px] lg:mt-[40px] lg:text-left text-center px-[10px] lg:px-[20px] py-[12px] rounded-[8px] lg:rounded-[50px] inline-block",
                                style: {
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    lineHeight: "21.6px",
                                    color: "white"
                                },
                                children: "Ihre Zeit ist wertvoll. Lassen Sie uns helfen."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 895,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 864,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 838,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden font-montserat rounded-[20px] max-w-[1290px] h-[360px] relative lg:flex flex-col items-center justify-center bg-cover mt-[100px] lg:mb-[160px]",
                style: {
                    backgroundImage: "url('/images/goldboxes.png')",
                    marginLeft: 'auto',
                    width: "100%",
                    maxWidth: "1270px",
                    minWidth: "1000px",
                    backgroundRepeat: 'no-repeat',
                    marginRight: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#B99B5F] font-metropolis font-semibold text-[44px] leading-[52.8px] text-center",
                        style: {
                            fontWeight: "600"
                        },
                        children: "Jetzt vormerken!"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 921,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[20px] leading-[25.6px] font-normal text-center mt-[12px]",
                        style: {
                            fontWeight: "400"
                        },
                        children: [
                            "Seien Sie unter den Ersten, die von unserer",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 937,
                                columnNumber: 48
                            }, this),
                            " innovativen Betreuung profitieren"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 931,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/Registrierung-Form1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-8 py-3 text-white font-metropolis text-[20px] font-medium leading-[21.6px] bg-[#B99B5F] rounded-full mt-[40px] ",
                            style: {
                                borderRadius: "50px"
                            },
                            children: "Klicken Sie hier, um sich unverbindlich zu registrieren und über den Start informiert zu werden!"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 942,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 941,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#B99B5F] font-metropolis text-[16px] font-normal leading-[25.6px] text-center mt-[30px]",
                        style: {
                            fontWeight: "400",
                            fontFamily: 'Metropolis',
                            fontStyle: 'italic'
                        },
                        children: "(Frühbucher erhalten exklusive Angebote!)"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 953,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 910,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mb-[160px] font-montserat rounded-[20px] lg:max-w-[1290px] px-2 py-4 relative flex flex-col items-center justify-center mt-[50px] block lg:hidden bg-[rgba(185,155,95,0.07)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#B99B5F] text-center text-[32px] font-[600] mb-2 mt-[4px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontSize: '32px',
                            fontWeight: '600',
                            lineHeight: '32px'
                        },
                        children: "Jetzt vormerken!"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 968,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-[16px] font-[400] mb-[32px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '25.6px'
                        },
                        children: "Seien Sie unter den Ersten, die von unserer innovativen Betreuung profitieren"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 982,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center px-4 mb-[32px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/Registrierung-Form1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "lg:py-[12px] lg:px-[30px] text-[18px] lg:text-[18px] font-[500] text-white bg-[#B99B5F] rounded-[10px] px-[15px] py-2 ",
                                style: {
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    lineHeight: '21.6px',
                                    color: '#FFF',
                                    textAlign: 'center',
                                    fontFamily: 'Metropolis',
                                    background: '#B99B5F',
                                    borderRadius: '10px'
                                },
                                children: [
                                    "Klicken Sie hier, um sich",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1011,
                                        columnNumber: 32
                                    }, this),
                                    " unverbindlich zu registrieren und",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1011,
                                        columnNumber: 75
                                    }, this),
                                    " über den Start informiert zu werden!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Registrierung.js",
                                lineNumber: 998,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 997,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 996,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-[16px] font-[400] mb-[4px]",
                        style: {
                            color: '#B99B5F',
                            textAlign: 'center',
                            fontFamily: 'Metropolis',
                            fontStyle: 'italic',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '25.6px'
                        },
                        children: "(Frühbucher erhalten exklusive Angebote!)  "
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Registrierung.js",
                        lineNumber: 1015,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 965,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:block hidden mt-[160px] mb-[120px] lg:flex flex-col justify-center items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start w-[1238px] h-[193px] px-6",
                    style: {
                        color: "#B99B5F",
                        fontFamily: "Metropolis",
                        width: "100%",
                        maxWidth: "1238px",
                        minWidth: "1000px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[#B99B5F] font-metropolis font-bold mb-2",
                                    style: {
                                        fontSize: "48px",
                                        lineHeight: "64.167%"
                                    },
                                    children: "Prime Home Care AG"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1043,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#B99B5F] font-metropolis",
                                    style: {
                                        fontSize: "22px",
                                        fontWeight: "500",
                                        lineHeight: "30.8px"
                                    },
                                    children: "Zusammen Gutes bewirken."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1053,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#B99B5F] font-metropolis mt-[80px] text-left",
                                    style: {
                                        fontSize: "22px",
                                        fontWeight: "500",
                                        fontFamily: "Metropolis",
                                        fontStyle: 'italic',
                                        lineHeight: "30.8px",
                                        wordSpacing: "12px"
                                    },
                                    children: "Einfach. Flexibel. Digital."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1064,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 1042,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col mt-[14px] items-left text-left gap-8",
                            style: {
                                color: "#B99B5F",
                                fontFamily: "Metropolis"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold",
                                    style: {
                                        fontSize: "24px",
                                        lineHeight: "30.8px"
                                    },
                                    children: "Kontakt:"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1087,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-normal text-[24px] leading-[30.8px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "mailto:info@phc.ch",
                                        children: "info@phc.ch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1099,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1096,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "www.phc.ch",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-normal text-[24px] leading-[30.8px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://www.phc.ch",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: "www.phc.ch"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Registrierung.js",
                                            lineNumber: 1108,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1105,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1104,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 1080,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Registrierung.js",
                    lineNumber: 1032,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 1030,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "block lg:hidden mt-[160px] mb-[160px] flex flex-col justify-start items-left",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col justify-start items-left text-left px-2",
                    style: {
                        color: "#B99B5F",
                        fontFamily: "Metropolis"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col mb-[80px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[#B99B5F font-bold",
                                    style: {
                                        fontSize: "32px",
                                        lineHeight: "30px"
                                    },
                                    children: "Prime Home Care AG"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1130,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#B99B5F] font-normal",
                                    style: {
                                        fontSize: "22px",
                                        fontWeight: "500",
                                        lineHeight: "30px"
                                    },
                                    children: "Zusammen Gutes bewirken."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1140,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#B99B5F] font-normal mt-[80px]",
                                    style: {
                                        fontSize: "22px",
                                        fontWeight: "500",
                                        lineHeight: "25.6px",
                                        fontFamily: "Metropolis",
                                        fontStyle: 'italic'
                                    },
                                    children: "Einfach. Flexibel. Digital."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1151,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 1129,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex text-[#B99B5F] flex-col text-left gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold",
                                    style: {
                                        fontSize: "24px",
                                        lineHeight: "30.8px"
                                    },
                                    children: "Kontakt:"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1167,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-normal text-[24px] leading-[30.8px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "mailto:info@phc.ch",
                                        children: "info@phc.ch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1177,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1176,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-normal",
                                    style: {
                                        fontSize: "24px",
                                        lineHeight: "30.8px"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.phc.ch",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: "www.phc.ch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Registrierung.js",
                                        lineNumber: 1188,
                                        columnNumber: 22
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Registrierung.js",
                                    lineNumber: 1181,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Registrierung.js",
                            lineNumber: 1166,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Registrierung.js",
                    lineNumber: 1121,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/Registrierung.js",
                lineNumber: 1119,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Registrierung.js",
        lineNumber: 7,
        columnNumber: 9
    }, this);
}
_c = Home;
var _c;
__turbopack_refresh__.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/Registrierung.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/Registrierung";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/Registrierung.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/src/pages/Registrierung (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/Registrierung.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__e0a812._.js.map