(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__93daef._.js", {

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
"[project]/src/pages/betreuung-zuhause-organisieren.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>HomeCarePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function HomeCarePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 flex flex-col justify-start items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter']",
                                children: "Stundenweise Betreuung Schweiz"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 9,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#FFFFFF]",
                                    children: [
                                        "Professionelle",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                            lineNumber: 13,
                                            columnNumber: 50
                                        }, this),
                                        " stundenweise",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                            lineNumber: 13,
                                            columnNumber: 72
                                        }, this),
                                        " Unterstützung im Alltag ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                            lineNumber: 13,
                                            columnNumber: 106
                                        }, this),
                                        "in der Schweiz"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                    lineNumber: 13,
                                    columnNumber: 3
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 12,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2",
                                children: [
                                    "Prime Home Care – Ihr zuverlässiger Partner für die Seniorenbetreuung ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 18,
                                        columnNumber: 71
                                    }, this),
                                    "zuhause in der Schweiz!  "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 17,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 8,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 mt-6 lg:mt-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/phc-hero-servicess.png",
                            alt: "Home Care",
                            className: "rounded-lg lg:w-[545px] lg:h-[335px] w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 6,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] lg:px-6  flex flex-col lg:flex-row items-top gap-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-intro2.png",
                        alt: "Senior care",
                        className: "w-full lg:w-1/2 rounded-lg lg:h-[700px] items-start flex justify-start align-top"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#04436F] text-[40px] lg:text-[56px] font-semibold leading-[50px] lg:leading-[64px] font-['Instrument Sans']",
                                children: [
                                    "Professionelle ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 32,
                                        columnNumber: 26
                                    }, this),
                                    "stundenweise Betreuung ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 32,
                                        columnNumber: 58
                                    }, this),
                                    "für den Alltag im"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-2",
                                children: "Die private Seniorenbetreuung zuhause stellt einen stetig wichtiger werdenden Bestandteil des Lebens dar."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 35,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4",
                                children: "Bei alltäglichen Aktivitäten wie der Körperpflege, der Zubereitung von Mahlzeiten, beim Einkaufen sowie bei der Hausarbeit können erfahrene und qualifizierte Betreuerinnen und Betreuer eine weitreichende Unterstützung leisten. Sie begleiten sie zu Arztterminen oder anderen Terminen, bieten Gesellschaft und Unterhaltung. Sie kümmern sich gerne um Haustiere und teilweise auch um Balkon und Pflanzen. Zudem wünschen sich viele Angehörige, dass stets eine vertraute Ansprechperson vor Ort ist, die im Haus für Schutz und Sicherheit sorgen kann."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 37,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4",
                                children: "Die Prime Home Care organisiert stundenweise Unterstützung sowie Betreuung und Pflege für das selbstbestimmte Leben im gewohnten Zuhause"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 39,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 28,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-[20px] mt-[120px] px-6 py-6 text-left bg-[#EDF2FB] lg:py-[120px] lg:px-[70px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                        children: [
                            "Sie müssen private Betreuung für sich ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 52,
                                columnNumber: 41
                            }, this),
                            "oder für einen nahen Angehörigen",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 52,
                                columnNumber: 82
                            }, this),
                            " organisieren?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#003588] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-[16px]",
                        children: [
                            "Sie haben das Gefühl, nicht alle Fakten zu kennen und sollen ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 56,
                                columnNumber: 62
                            }, this),
                            "weitreichende und kostspielige Entscheidungen erst noch unter",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 56,
                                columnNumber: 132
                            }, this),
                            " Zeitdruck treffen?",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 56,
                                columnNumber: 160
                            }, this),
                            "Registrieren Sie sich und erstellen Sie ihre eigene Offerte direkt",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 57,
                                columnNumber: 67
                            }, this),
                            " und einfach"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 55,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-[#04436F] text-white lg:mt-[60px] px-6 py-3 rounded-full text-[18px] font-medium mt-6 transition duration-300 hover:bg-[#6FCF97]",
                        children: "Jetzt registrieren                    "
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 50,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] px-0 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex lg:flex-row flex-col gap-8 lg:gap-0 items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo1testt.png",
                                alt: "Care 1",
                                className: "rounded-[20px] lg:max-w-[294px] w-full lg:mt-[305px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 69,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo2testt.png",
                                alt: "Care 2",
                                className: "rounded-[20px] lg:max-w-[405px] w-full  lg:ml-[-120px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 71,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo3testt.png",
                                alt: "Care 3",
                                className: " lg:max-w-[405px] rounded-[20px] w-full lg:mt-[250px] lg:ml-[-140px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 73,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 68,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-left lg:ml-[190px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Unsere Lösungen ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 82,
                                        columnNumber: 21
                                    }, this),
                                    "für eine optimale",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 82,
                                        columnNumber: 47
                                    }, this),
                                    " Betreuungs-",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 82,
                                        columnNumber: 68
                                    }, this),
                                    "Organisation"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 81,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] font-light leading-[24px] font-['Metropolis'] mt-4",
                                children: [
                                    "Wir bei Prime Home Care haben viele Jahre",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 46
                                    }, this),
                                    " Erfahrung in der professionellen Betreuung von ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 103
                                    }, this),
                                    "Senioren und pflegebedürftigen Menschen",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 151
                                    }, this),
                                    " gesammelt. Hand in Hand mit externen",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 197
                                    }, this),
                                    " Pflegefachleuten, die uns bei der",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 240
                                    }, this),
                                    " Bedarfsanalyse unterstützen, organisieren wir",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 295
                                    }, this),
                                    " für Sie und Ihre Angehörigen individuelle und",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 350
                                    }, this),
                                    " ganzheitliche Betreuungslösungen.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 87,
                                        columnNumber: 393
                                    }, this),
                                    "  Wir haben uns zum Ziel gesetzt, unseren",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 88,
                                        columnNumber: 44
                                    }, this),
                                    " Kunden eine umfassende und neutrale Beratung",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 88,
                                        columnNumber: 98
                                    }, this),
                                    " sowie eine nahtlose Organisation rund um das",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 88,
                                        columnNumber: 152
                                    }, this),
                                    " Thema Pflege und Seniorenbetreuung zuhause",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 88,
                                        columnNumber: 204
                                    }, this),
                                    " zu bieten. Im Folgenden stellen wir Ihnen einige",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 88,
                                        columnNumber: 262
                                    }, this),
                                    " unserer Lösungen vor."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 86,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 78,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 65,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] lg:px-6  flex flex-col lg:flex-row items-center gap-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#003588] text-[33px] lg:text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Moderne Seniorenbetreuung –",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 99,
                                        columnNumber: 38
                                    }, this),
                                    " digital, flexibel und persönlich"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px]  font-light leading-[24.6px]  font-['Metropolis'] mt-2",
                                children: "Die Prime Home Care organisiert bedarfsgerechte und qualitativ hochwertige Seniorenbetreuung für das eigene Zuhause. Ganzheitlich überblicken wir den gesamten Prozess der häuslichen Betreuung mit allen dafür benötigten Pflegeleistungen und beziehen auch die benötigten Hilfsmittel und baulichen Massnahmen mit in unsere Überlegungen ein."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 101,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px]  font-light leading-[24.6px]  font-['Metropolis'] mt-4",
                                children: "Die Prime Home Care ist selbst kein Pflege-Anbieter oder Personaldienstleister. Es ist jedoch unser Ziel, die jeweils individuell beste und günstigste Hilfe für den Alltag in der gewohnten Umgebung zu organisieren. Dabei sind wir einzig unseren Kunden verpflichtet und agieren treuhänderisch. Unsere Empfehlungen orientieren sich allein an Ihren jeweiligen Betreuungs- und Pflegebedürfnissen. Unsere eigenen Leistungen erbringen wir zum Fixpreis und sind in unserer Beratung daher unabhängig davon, welche Lösung aus Anbietersicht lukrativer erscheint."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 104,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] font-light leading-[24.6px] font-['Metropolis'] mt-4",
                                children: "Bei der Organisation professioneller Seniorenbetreuung in der Schweiz ist dieser Ansatz völlig neu. Erfahren Sie mehr über unsere Lösungen für die häufigsten Probleme bei der privaten Altenbetreuung zu Hause."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 106,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/image123.png",
                        alt: "Senior care",
                        className: "w-full lg:w-1/2 rounded-lg lg:h-[547px] items-start flex justify-start align-top"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 95,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden",
                style: {
                    backgroundImage: 'url(/images/phc-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-[44px] font-semibold leading-[52.8px]",
                        children: "Join our community of care"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 117,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10",
                        children: [
                            "At Prime Home Care, we're here to provide compassionate and personalized care to you",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 121,
                                columnNumber: 89
                            }, this),
                            " or your loved ones."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 120,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-[#04436F] w-[140px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]",
                        children: "Get started"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 123,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 113,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px]  flex flex-col lg:flex-row items-start gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-section1.png",
                        alt: "Care model",
                        className: "lg:h-[500px] w-full lg:w-1/2 rounded-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left lg:px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Qualifizierte Betreuung –",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 136,
                                        columnNumber: 36
                                    }, this),
                                    " intelligent gematcht"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2",
                                children: [
                                    "Die eigene Suche nach geeigneten, qualifizierten und zuverlässigen Betreuerinnen und Betreuern ist oft ein langwieriger und mühsamer Prozess. Lieber möchten sich Senioren und Angehörige auf professionelle Anbieter verlassen. Wer aber stellt sicher, dass Betreuungskräfte über die notwendigen Fähigkeiten verfügen, sie sorgfältig ausgewählt und geschult werden?  Werden Betreuungskräfte eingesetzt, die mindestens über ein in der Schweiz anerkanntes Pflegehelfer-Zertifikat verfügen, so können diejenigen Stunden, welche Grundpflege darstellen, kassenfähig gestaltet werden. Dafür sorgen wir aufgrund unserer Zusammenarbeit mit bewilligten Spitex-Partnern unter deren unter Weisung und Obhut dann die Pflege erfolgt. So wird sichergestellt, dass jede Betreuungskraft über ausreichende Erfahrung und Qualifikationen verfügt. Die Betreuungs- und Pflegekräfte erhalten neben Weiterbildung so auch eine Entlastung bei ihrer Pflegearbeit. ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 139,
                                        columnNumber: 572
                                    }, this),
                                    "Dank der Beteiligung der Krankenkassen an den Betreuungskosten können Sie den Pflegekräften gerne ein überdurchschnittliches Gehalt bezahlen, ohne dass sich dies negativ auf Ihre Gesamtkosten auswirkt. "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 137,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 132,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px]  flex flex-col lg:flex-row items-start gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Individuell wählbare Leistungen – Betreuung nach Ihren ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 148,
                                        columnNumber: 66
                                    }, this),
                                    "Wünschen"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2",
                                children: [
                                    "Bei der Prime Home Care AG steht nicht ein starres Betreuungspaket im Vordergrund, sondern Ihre individuelle Auswahl. Über unsere benutzerfreundliche Online-Plattform stellen Sie sich Ihre gewünschten Dienstleistungen einfach und bequem selbst zusammen – ganz nach Ihrem Bedarf, ohne unnötige Zusatzleistungen.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 152,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 152,
                                        columnNumber: 9
                                    }, this),
                                    "Ob Alltagshilfe, Begleitung zu Terminen, Unterstützung im Haushalt oder soziale Aktivitäten – Sie entscheiden, was gebraucht wird, wann es gebraucht wird und wie oft. Unsere digitale Lösung ermöglicht es Ihnen, alles übersichtlich zu planen, direkt zu buchen und jederzeit flexibel anzupassen."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 150,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-section3.png",
                        alt: "Care model",
                        className: "lg:h-[500px] w-full lg:w-1/2 rounded-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 145,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px]  flex flex-col lg:flex-row items-start gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-section2.png",
                        alt: "Care model",
                        className: "lg:h-[500px] w-full lg:w-1/2 rounded-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left lg:px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: "Transparente und faire Preise"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2",
                                children: [
                                    "Die Prime Home Care AG verfolgt das Ziel, hochwertige Betreuung und faire Löhne in ein ausgewogenes und nachhaltiges Verhältnis zu bringen. Dank unserer digitalen Plattform und durchdachter Prozessgestaltung ermöglichen wir ein effizientes Modell, das sowohl Betreuungspersonen gerecht entlohnt als auch unseren Kund:innen faire, transparente Kosten bietet.Als Kund:in profitieren Sie doppelt:",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 166,
                                        columnNumber: 394
                                    }, this),
                                    "Einerseits von motivierten Betreuungspersonen, die mit Freude und Engagement arbeiten – andererseits von einer übersichtlichen Kostenstruktur ohne versteckte Gebühren. Über unsere Plattform erhalten Sie auf Knopfdruck eine klare Offerte, basierend auf Ihren gewählten Leistungen.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 166,
                                        columnNumber: 682
                                    }, this),
                                    "Durch digitale Abläufe, direkte Buchung und automatisierte Planung schaffen wir es, erstklassige stundenweise Betreuung zu einem sehr fairen Preis-Leistungs-Verhältnis anzubieten – einfach, effizient und menschlich.Wir bieten Ihnen ein klar strukturiertes, transparentes Preismodell, das Betreuung planbar und sorgenfrei macht – mit einem digitalen Ansprechpartner an Ihrer Seite.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 166,
                                        columnNumber: 1071
                                    }, this),
                                    " Prime Home Care AG – Betreuung nach Mass, digital organisiert."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 165,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 160,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                        children: "Häufig gestellte Fragen bei der Betreuungs-Organisation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#04436F] lg:px-[60px] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-3",
                        children: [
                            "Wir haben hier für Sie einige der am häufigsten gestellten Fragen zusammengestellt.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 181,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            "Ihre Frage wurde nicht beantwortet? Warum treten Sie nicht direkt mit uns in Kontakt? Unser",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 183,
                                columnNumber: 10
                            }, this),
                            " Team freut sich, von Ihnen zu hören!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 179,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]",
                        children: [
                            "Wie wird sichergestellt, dass die Pflegekräfte zuverlässig und qualifiziert sind?",
                            "Wie funktioniert die Abrechnung und Bezahlung Ihrer Dienstleistungen?",
                            "Was passiert, wenn sich die Betreuungs-Bedürfnisse im Laufe der Zeit ändern?",
                            "Wie läuft die Betreuungs-Organisation ab, wenn Betreuung und Pflege kurzfristig notwendig ist oder unerwartet mehr Unterstützung benötigt wird?",
                            "Wie wird sichergestellt, dass die Pflegekräfte individuelle Bedürfnisse und Wünsche verstehen und umsetzen?"
                        ].map((faq, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#EDF2FB] p-5 rounded-[20px] flex justify-between items-center cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']",
                                        children: faq
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 198,
                                        columnNumber: 7
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
                                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                            lineNumber: 206,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M16.4443 10.409L11.9999 14.8535L7.5554 10.409",
                                                            stroke: "white",
                                                            strokeWidth: "1.33333",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                            lineNumber: 207,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                    lineNumber: 205,
                                                    columnNumber: 11
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
                                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                            lineNumber: 211,
                                                            columnNumber: 15
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                        lineNumber: 210,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                                    lineNumber: 209,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                            lineNumber: 204,
                                            columnNumber: 9
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                        lineNumber: 203,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                                lineNumber: 193,
                                columnNumber: 5
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                        lineNumber: 185,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
                lineNumber: 173,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/betreuung-zuhause-organisieren.js",
        lineNumber: 3,
        columnNumber: 7
    }, this);
}
_c = HomeCarePage;
var _c;
__turbopack_refresh__.register(_c, "HomeCarePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/betreuung-zuhause-organisieren.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/betreuung-zuhause-organisieren";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/betreuung-zuhause-organisieren.js [client] (ecmascript)");
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
"[project]/src/pages/betreuung-zuhause-organisieren (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/betreuung-zuhause-organisieren.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__93daef._.js.map