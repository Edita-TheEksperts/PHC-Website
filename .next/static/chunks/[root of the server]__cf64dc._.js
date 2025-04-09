(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__cf64dc._.js", {

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
"[project]/src/pages/index.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [client] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-[1430px] bg-[#EDF2FB] rounded-[20px] mx-auto flex flex-col lg:flex-row items-center gap-6 lg:px-[70px]  px-4 py-12 lg:py-[70px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 gap-[32px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[#04436F] text-[45px] lg:text-[65px] font-semibold lg:leading-[80px]",
                                children: [
                                    "Individuelle",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 11,
                                        columnNumber: 15
                                    }, this),
                                    " Betreuungslös",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 11,
                                        columnNumber: 38
                                    }, this),
                                    "ungen für Ihr",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 11,
                                        columnNumber: 60
                                    }, this),
                                    " Zuhause"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 10,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "mt-6 px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF]    text-[24px] font-medium leading-[32px]    rounded-[50px] flex items-center justify-center    hover:bg-[#033559] transition    text-center",
                                children: "Entdecken Sie unsere Leistungen"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 15,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex -space-x-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/phc-avatar1.png",
                                            alt: "Staff 1",
                                            width: 50,
                                            height: 50,
                                            className: "rounded-full border border-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 27,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/phc-avatar2.png",
                                            alt: "Staff 2",
                                            width: 50,
                                            height: 50,
                                            className: "rounded-full border border-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 28,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/phc-avatar3.png",
                                            alt: "Staff 3",
                                            width: 50,
                                            height: 50,
                                            className: "rounded-full border border-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 29,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/phc-avatar4.png",
                                            alt: "Staff 3",
                                            width: 50,
                                            height: 50,
                                            className: "rounded-full border border-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 30,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.js",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-[30px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[#04436F] text-[22px] font-semibold leading-[26.4px]",
                                    children: [
                                        "Hilfreiche Lösungen für eine selbstbestimmte ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 37,
                                            columnNumber: 56
                                        }, this),
                                        "Pflege zu Hause"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.js",
                                    lineNumber: 36,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-2 space-y-2 text-[#04436F] text-[16px] font-normal leading-[25.6px] pl-[30px] list-disc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Volldigitale Plattform"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 41,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Die innovative Betreuungslösung"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/phc-hero-phc123.png",
                            alt: "Elderly care",
                            width: 800,
                            height: 600,
                            className: "rounded-[20px]"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/index.js",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-[1430px] mx-auto px-6 mt-[120px] ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-center text-[30px] leading-[37px] lg:text-[55px] font-semibold lg:leading-[71.5px] pt-4",
                        children: [
                            "Entdecken Sie unser umfassendes",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 56,
                                columnNumber: 38
                            }, this),
                            " Dienstleistungsangebot"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 55,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 lg:mt-[70px] grid grid-cols-1 lg:px-[120px] md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-[60px] ",
                        children: [
                            {
                                title: "Alltagsbegleitung & Besorgungen",
                                description: "Wir begleiten Sie zuverlässig zu Arztterminen, Therapien, Behördengängen oder beim Einkaufen – ob Supermarkt, Apotheke oder Modegeschäft. Auch Postgänge und sonstige Erledigungen übernehmen wir gerne.",
                                icon: "/images/phc-icon-nursing.png"
                            },
                            {
                                title: "Freizeit & soziale Aktivitäten",
                                description: "Für mehr Lebensfreude im Alltag: Wir leisten Gesellschaft, kochen gemeinsam, lesen vor, spielen Karten oder begleiten Sie zu Theater, Kino, Konzerten, Sportanlässen oder in den Urlaub.",
                                icon: "/images/phc-icon-companion.png"
                            },
                            {
                                title: "Gesundheitsfürsorge & Grundpflege",
                                description: "Einfühlsame Unterstützung bei der Körperpflege, Nahrungsaufnahme und bei alltäglichen pflegerischen Aufgaben – ergänzt durch gesundheitsfördernde Aktivitäten für Körper und Geist.",
                                icon: "/images/phc-icon-health-aides.png"
                            },
                            {
                                title: "Haushaltshilfe & Wohnpflege",
                                description: "Wir sorgen für ein sauberes, gepflegtes Zuhause: von Kochen, Waschen und Bügeln bis hin zu Fenster putzen, Staubsaugen, Pflanzenpflege oder dem Wechseln der Bettwäsche.",
                                icon: "/images/phc-icon-medication.png"
                            }
                        ].map((service, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[FAFCFF] p-4 lg:p-[40px] rounded-[20px] flex flex-col justify-center items-center text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[100px] h-[100px] bg-[#EDF2FB] rounded-full flex justify-center items-center mb-[30px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: service.icon,
                                            alt: service.title,
                                            width: 50,
                                            height: 50
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 94,
                                            columnNumber: 9
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 93,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[#04436F] text-center text-[28px] font-semibold leading-[33.6px]",
                                        children: service.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 98,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-center text-[16px] font-normal leading-[25.6px] mt-[10px]",
                                        children: service.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 103,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 88,
                                columnNumber: 5
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 61,
                        columnNumber: 1
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative mt-[120px]  rounded-[20px]  mx-auto p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full h-[350px] lg:h-[576px] overflow-hidden rounded-[20px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/phc-bg-hero.png" // Change this to your image path
                                ,
                                alt: "Consultation",
                                layout: "fill",
                                objectFit: "cover",
                                className: "rounded-[20px] lg:block hidden "
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 116,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/phc-bg-hero-mobile.jpg" // Change this to your image path
                                ,
                                alt: "Consultation",
                                layout: "fill",
                                objectFit: "cover",
                                className: "rounded-[20px] lg:hidden block bg-black bg-opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 123,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 lg:mt-[-100px]  rounded-[20px] flex flex-col gap-3 lg:gap-[30px] justify-center items-center text-center px-6 ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#FAFCFF] text-[18px]  font-normal leading-[23.4px]    px-[10px] py-[2px] flex flex-col items-start    rounded-l-[50px] rounded-r-none    bg-[linear-gradient(97deg,#04436F_0%,rgba(0,0,0,0.00)_100%)] text-center",
                                        children: "Get in Touch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 132,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-[#FAFCFF] text-center   text-[32px] lg:text-[55px] font-semibold leading-[38px] lg:leading-[71.5px] mt-2",
                                        children: [
                                            "Haben Sie Fragen oder",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 141,
                                                columnNumber: 34
                                            }, this),
                                            " sind Sie bereit für ein",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 141,
                                                columnNumber: 67
                                            }, this),
                                            " Onlinegespräch?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "mt-4 px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF]    text-[18px] font-medium leading-[21.6px]    rounded-[50px] flex flex-col items-center text-center    hover:bg-[#033559] transition",
                                        children: "Schedule a home visit"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 144,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 131,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 115,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "marginclass mt-10 lg:mt-[-80px] z-999 lg:ml-[850px] relative flex flex-row justify-center items-center gap-[40px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col lg:items-right lg:text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:block hidden",
                                        children: "Buchen Sie hier ihren online-Termin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 158,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:hidden block",
                                        children: [
                                            "Buchen Sie hier",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 162,
                                                columnNumber: 24
                                            }, this),
                                            " ihren online-Termin"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 161,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-[16px] font-normal leading-[25.6px] lg:text-right underline",
                                        children: "Lorem"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 165,
                                        columnNumber: 1
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 157,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[80px] h-[80px] bg-[#B99B5F] rounded-full flex justify-center items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    width: "51",
                                    height: "51",
                                    viewBox: "0 0 51 51",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mask", {
                                            id: "mask0",
                                            maskUnits: "userSpaceOnUse",
                                            x: "0",
                                            y: "0",
                                            width: "51",
                                            height: "51",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M50.4805 50.3526V0.450195H0.578125V50.3526H50.4805Z",
                                                fill: "white",
                                                stroke: "white",
                                                strokeWidth: "0.0976562"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 185,
                                                columnNumber: 9
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 177,
                                            columnNumber: 7
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            mask: "url(#mask0)",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M9.27735 41.6529C-7.28808 25.0874 7.2461 12.4911 10.7268 17.2307C10.7268 17.2307 13.9509 21.2203 14.6621 22.1502C15.3731 23.08 16.147 24.626 12.6138 27.3223C8.51993 30.4466 11.5208 34.1175 14.1462 36.7839C16.8126 39.4094 20.4836 42.4102 23.6078 38.3162C26.3041 34.7831 27.8501 35.557 28.7799 36.268C29.7098 36.9791 33.6994 40.2033 33.6994 40.2033C38.4389 43.6841 25.8426 58.2183 9.27735 41.6529Z",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 193,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M34.9043 1.37793C42.9945 1.37793 49.5528 7.93623 49.5528 16.0264C49.5528 24.1165 42.9945 30.6748 34.9043 30.6748C32.1017 30.6748 29.483 29.8872 27.2569 28.5219C25.6887 28.9428 24.1203 29.3635 22.5518 29.7838C21.7147 30.0202 20.9129 29.2541 21.1423 28.3933C21.5641 26.8189 21.9861 25.2458 22.4082 23.6729C21.0433 21.4471 20.2559 18.8287 20.2559 16.0264C20.2559 7.93623 26.8142 1.37793 34.9043 1.37793Z",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 201,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.70508 17.9458L12.7347 26.7336",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 209,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M33.0369 45.2532L24.1592 38.1514",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 217,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M34.1368 6.97287C35.0863 7.92238 35.0863 9.47609 34.1368 10.4255L29.303 15.2594C28.3535 16.2088 26.7998 16.2088 25.8502 15.2594C24.9008 14.3097 24.9008 12.7561 25.8502 11.8066L30.6841 6.97287C31.6335 6.02336 33.1872 6.02336 34.1368 6.97287Z",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 225,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M28.6128 9.73486L31.3748 12.497",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 233,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M35.8805 25.7919C38.3008 25.7919 40.275 23.8178 40.275 21.3974C40.275 18.977 38.3008 17.0029 35.8805 17.0029C33.46 17.0029 31.4858 18.977 31.4858 21.3974C31.4858 23.8178 33.46 25.7919 35.8805 25.7919Z",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 241,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M31.9741 21.3975H35.8803",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 249,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M35.8813 16.9267C35.9012 15.7879 36.3624 14.7014 37.1678 13.896C38.8839 12.1798 41.6664 12.1798 43.3825 13.896C45.0987 15.6121 45.0987 18.3946 43.3825 20.1108C42.5772 20.9162 41.4905 21.3774 40.3518 21.3972",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 257,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M39.2441 18.0343L40.2751 17.0034",
                                                    stroke: "white",
                                                    strokeWidth: "1.95312",
                                                    strokeMiterlimit: "22.926",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 265,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 192,
                                            columnNumber: 7
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.js",
                                    lineNumber: 170,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 169,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 155,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-[1400] mt-[120px] mx-auto p-4 lg:px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-[80px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full lg:w-[610px] h-[400px] lg:h-[730px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/phc-easy-care-steps.png" // Change to your actual image path
                            ,
                            alt: "Easy Care",
                            layout: "fill",
                            objectFit: "cover rounded-[20px]"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/index.js",
                            lineNumber: 284,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 283,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-[10px] lg:pl-[14px] lg:pr-[100px] px-[14px] py-[2px] text-[#FAFCFF] text-[18px] font-normal leading-[23.4px] rounded-l-[50px]  inline-block",
                                style: {
                                    background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)"
                                },
                                children: "Wie wir arbeiten"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 295,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#04436F] text-[32px] lg:text-[55px] font-semibold leading-[40px] lg:leading-[71.5px] mb-10 lg:mb-[70px]",
                                children: [
                                    "So einfach geht’s –",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 305,
                                        columnNumber: 28
                                    }, this),
                                    "in drei Schritten"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 304,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6 lg:space-y-[50px]",
                                children: [
                                    {
                                        number: "01",
                                        title: "Registration",
                                        description: "Erstellen Sie Ihr Profil samt Ihren Wünschen an die Betreuung",
                                        bgColor: "bg-[#EDF2FB]",
                                        textColor: "text-[#003588]"
                                    },
                                    {
                                        number: "02",
                                        title: "Passende Betreuungsperson finden",
                                        description: "Wir finden die richtige Betreuungsperson – einfühlsam, fachlich versiert und zuverlässig.",
                                        bgColor: "bg-[#B99B5F]",
                                        textColor: "text-white"
                                    },
                                    {
                                        number: "03",
                                        title: "Geniessen Sie Ihre Betreuung Zuhause",
                                        description: "Wir übernehmen die Betreuung – Sie oder Ihre Angehörigen können sich entspannen.",
                                        bgColor: "bg-[#003588]",
                                        textColor: "text-white"
                                    }
                                ].map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-2 lg:gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `lg:w-[70px] lg:h-[70px] h-[35px] w-[40px] text-[22px] lg:text-[36px] flex items-center justify-center  font-[500] rounded-full ${step.bgColor} ${step.textColor}`,
                                                children: step.number
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 340,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-[#04436F] text-[22px] lg:text-[28px] font-medium leading-[28px] lg:leading-[33.6px]",
                                                        children: step.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 348,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[#04436F] lg:w-[500px] text-[16px] font-normal leading-[25.6px]",
                                                        children: step.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 311,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 293,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 280,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "text-center mt-[120px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-[55px] mb-4 lg:mb-[70px] font-semibold leading-[71.5px] text-center",
                        children: "Unsere Preismodelle"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-[20px] text-center relative overflow-hidden bg-[#FFFFFF]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full p-[50px] text-left rounded-t-[20px] bg-[#EDF2FB] text-[#000000]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-[22px] font-medium leading-[30.8px]",
                                                children: "Regelmässige Betreuung"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 378,
                                                columnNumber: 1
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-baseline gap-1 mt-[20px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#04436F] text-[48px] font-semibold leading-[70px] ",
                                                        children: "CHF 49/"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 384,
                                                        columnNumber: 3
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#04436F] text-[16px] font-normal leading-[25px] ",
                                                        children: "Stunde"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 387,
                                                        columnNumber: 3
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 383,
                                                columnNumber: 1
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 375,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-[50px] flex flex-col justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] list-disc pl-[20px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Personal care assistance"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 397,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Medication reminders"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 398,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Meal preparation and feeding assistance"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 399,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Companionship and emotional support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 400,
                                                    columnNumber: 5
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 396,
                                            columnNumber: 3
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 394,
                                        columnNumber: 1
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:mt-[100px] mt-6 mb-[50px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium    transition duration-300 hover:bg-[#6FCF97]",
                                            children: "Book now"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 407,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 406,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 372,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-[20px] text-center relative overflow-hidden bg-[#EDF2FB]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full p-[50px] text-left rounded-t-[20px] bg-[#B99B5F] text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-[22px] font-medium leading-[30.8px] ",
                                                children: "Einmalige Einsätze"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 422,
                                                columnNumber: 1
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-baseline gap-1 mt-[20px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-[48px] font-semibold leading-[70px] ",
                                                        children: "CHF 60/"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 428,
                                                        columnNumber: 3
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-[16px] font-normal leading-[25px]",
                                                        children: "Stunde"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 431,
                                                        columnNumber: 3
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 427,
                                                columnNumber: 1
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 419,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-[50px] flex flex-col justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] list-disc pl-[20px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Personal care assistance"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 441,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Medication reminders"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 442,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Meal preparation and feeding assistance"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 443,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Companionship and emotional support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 444,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Companionship and emotional support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 445,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Companionship and emotional support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 447,
                                                    columnNumber: 5
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Companionship and emotional support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 449,
                                                    columnNumber: 5
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 440,
                                            columnNumber: 3
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 438,
                                        columnNumber: 1
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:mt-[100px] mt-6 mb-[50px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium    transition duration-300 hover:bg-[#6FCF97]",
                                            children: "Get Started"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 457,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 456,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 416,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-[50px] lg:h-[730px] rounded-[20px] text-center bg-[#EDF2FB] flex flex-col justify-between h-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full text-left text-[22px] font-medium leading-[30.8px]    rounded-t-[20px]  text-[#04436F]",
                                        children: "Individuelle Dientsleitungen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 469,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-left text-[16px] font-normal leading-[25.6px]  mt-[20px] mb-[20px]",
                                        children: [
                                            "Wir bei der Prime Home Care AG ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 474,
                                                columnNumber: 36
                                            }, this),
                                            "verstehen die individuellen Bedürfnisse",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 474,
                                                columnNumber: 84
                                            }, this),
                                            " unserer Kunden"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 473,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-4 text-left space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px]  list-disc pl-[20px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "24 Stunden Live-In Betreuung"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 479,
                                                columnNumber: 5
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "Ferienbegleitung"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 480,
                                                columnNumber: 5
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "Konzertbesuche"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 481,
                                                columnNumber: 5
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "Biographiearbeit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 482,
                                                columnNumber: 5
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 478,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:mt-[100px] items-center justify-center mt-[60px] lg:mb-[50px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium    transition duration-300 hover:bg-[#6FCF97]",
                                            children: "Contact us"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 489,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 488,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 466,
                                columnNumber: 3
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 369,
                        columnNumber: 1
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 364,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-[#EDF2FB] mt-[180px] max-w-[1430px] mx-auto p-4 px-4 py-4 lg:px-[70px] lg:py-[120px] rounded-[20px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#003588] font-['Metropolis'] text-left text-[32px] lg:text-[42px] font-semibold  mb-[50px]",
                        children: "Was unsere Kunden über uns sagen"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-[30px] rounded-[20px] flex flex-col lg:w-[396px] lg:h-[547px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1 mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "140",
                                            height: "25",
                                            viewBox: "0 0 140 25",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z",
                                                    fill: "#04436F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 514,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z",
                                                    fill: "#04436F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 515,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z",
                                                    fill: "#04436F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 516,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z",
                                                    fill: "#04436F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 517,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z",
                                                    fill: "#04436F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 518,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 513,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 512,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6",
                                        children: '"Dank der stundenweisen Betreuung durch Prime Home Care kann ich weiterhin zu Hause leben – genau so, wie ich es mir wünsche. Meine Betreuerin hilft mir beim Einkaufen und leistet mir Gesellschaft. Ich freue mich jedes Mal auf ihren Besuch."          '
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 521,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mt-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/avatar1.png",
                                                width: 70,
                                                height: 70,
                                                className: "rounded-full",
                                                alt: "Client 1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 524,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[#04436F] leading-[26px] font-[500] text-[22px]",
                                                        children: "Lorem Ipsum"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 526,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[#04436F] text-[16px] leading-[25px]",
                                                        children: "Lorem Ipsum"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 527,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 525,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 523,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 511,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[547px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-[30px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1 mb-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "140",
                                                    height: "25",
                                                    viewBox: "0 0 140 25",
                                                    fill: "none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 539,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 540,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 541,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 542,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 543,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 538,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 537,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6",
                                                children: "I was apprehensive at first, but from my very first visit, I felt welcomed and cared for. The caregivers and staff are like family."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 547,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 mt-auto lg:mt-[70px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[#04436F] leading-[26px] font-[500] text-[22px]",
                                                            children: "Lorem Ipsum"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 552,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[#04436F] text-[16px] leading-[25px]",
                                                            children: "Lorem Ipsum"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 553,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 551,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 550,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 536,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-[238px] overflow-hidden rounded-b-[20px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/testimonial-img.png" // Replace with your actual image path
                                            ,
                                            width: 393,
                                            height: 230,
                                            className: "w-full h-full object-cover",
                                            alt: "Testimonial"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 558,
                                            columnNumber: 5
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 557,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[547px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-[238px] overflow-hidden rounded-t-[20px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/testimonial-img.png" // Replace with your actual image path
                                            ,
                                            width: 393,
                                            height: 238,
                                            className: "w-full h-full object-cover",
                                            alt: "Testimonial"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 570,
                                            columnNumber: 5
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 569,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-[30px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1 mb-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "140",
                                                    height: "25",
                                                    viewBox: "0 0 140 25",
                                                    fill: "none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 581,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 582,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 583,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 584,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 585,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 580,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 579,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6",
                                                children: "I was apprehensive at first, but from my very first visit, I felt welcomed and cared for. The caregivers and staff are like family."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 589,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 mt-auto lg:mt-[70px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[#04436F] leading-[26px] font-[500] text-[22px]",
                                                            children: "Lorem Ipsum"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 594,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[#04436F] text-[16px] leading-[25px]",
                                                            children: "Lorem Ipsum"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 595,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 593,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/index.js",
                                                lineNumber: 592,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 578,
                                        columnNumber: 3
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 568,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 509,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 503,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] mb-[120px] text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-center text-[55px] font-semibold leading-[71.5px]",
                        children: "Haben Sie noch Fragen?"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 607,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]",
                        children: [
                            "What types of services does Prime Home Care offer?",
                            "How do I know if home care is right for me or my loved one?",
                            "How are caregivers selected and trained?",
                            "What if I need to cancel or reschedule a visit?",
                            "How does billing work for Prime Home Care services?"
                        ].map((faq, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#EDF2FB] p-5 rounded-[20px] flex justify-between items-center cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']",
                                        children: faq
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 625,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[24px] h-[26px] flex justify-center items-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "24",
                                            height: "26",
                                            viewBox: "0 0 24 26",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    "clip-path": "url(#clip0_1352_2251)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 633,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M16.4443 10.409L11.9999 14.8535L7.5554 10.409",
                                                            stroke: "white",
                                                            strokeWidth: "1.33333",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 634,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 632,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                                        id: "clip0_1352_2251",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            width: "24",
                                                            height: "25",
                                                            fill: "white",
                                                            transform: "matrix(-1 0 0 -1 24 25.1309)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/index.js",
                                                            lineNumber: 638,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.js",
                                                        lineNumber: 637,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/index.js",
                                                    lineNumber: 636,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/index.js",
                                            lineNumber: 631,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.js",
                                        lineNumber: 630,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/index.js",
                                lineNumber: 620,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 612,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 606,
                columnNumber: 14
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/index.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_refresh__.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/index.js [client] (ecmascript)");
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
"[project]/src/pages/index (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__cf64dc._.js.map