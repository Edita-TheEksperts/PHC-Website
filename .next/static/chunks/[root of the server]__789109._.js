(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__789109._.js", {

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
"[project]/src/pages/hausliche-pflege-planen.js [client] (ecmascript)": ((__turbopack_context__) => {
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
                        className: "lg:w-1/2 mt-6 lg:mt-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/hero-services.png",
                            alt: "Home Care",
                            className: "rounded-lg lg:w-[545px] lg:h-[335px] w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                            lineNumber: 8,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 7,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 flex flex-col justify-start items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:mt-[38px] lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#FFFFFF]",
                                    children: [
                                        "Beratung und Organisation von",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                            lineNumber: 13,
                                            columnNumber: 65
                                        }, this),
                                        " Betreuung zu Hause"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                    lineNumber: 13,
                                    columnNumber: 3
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 12,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2",
                                children: "Willkommen bei Prime Home Care – Ihr zuverlässiger Partner für die Organisation von häuslicher Betreuung & Pflege in der Schweiz! "
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 17,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 6,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] px-6 lg:px-2 flex flex-col lg:flex-row items-center gap-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-intro1.png",
                        alt: "Senior care",
                        className: "w-full lg:w-1/2 rounded-lg lg:h-[647px] items-start flex justify-start align-top"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#04436F] text-[40px] lg:text-[56px] font-semibold leading-[50px] lg:leading-[64px] font-['Instrument Sans']",
                                children: [
                                    "Unsere Organisation – ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 31,
                                        columnNumber: 25
                                    }, this),
                                    "Für bessere Seniorenbetreuung im Alter"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-2",
                                children: "Die Prime Home Care AG ist Ihre moderne Partnerin für stundenweise Betreuung zu Hause – flexibel, digital organisiert und persönlich umgesetzt. Ob Gesellschaft leisten, Begleitung zu Terminen, Unterstützung im Haushalt oder bei Freizeitaktivitäten: Unsere Dienstleistungen lassen sich individuell kombinieren und bequem digital planen. So erhalten Sie genau die Unterstützung, die Sie brauchen – zur richtigen Zeit und mit vertrauten Betreuungspersonen. Als digitales Unternehmen setzen wir auf einfache Abläufe, schnelle Verfügbarkeit und transparente Kommunikation – ganz ohne Papierkram. Die Betreuung bleibt menschlich und herzlich – die Organisation übernehmen wir im Hintergrund effizient und unkompliziert. Prime Home Care AG – moderne Betreuung mit Herz und System."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 34,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] px-6 lg:px-2  flex flex-col lg:flex-row items-start gap-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Die Prime Home Care AG bietet ein breites Spektrum an Leistungen für die",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 47,
                                        columnNumber: 83
                                    }, this),
                                    " stundenweise Betreuung"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px]  font-light leading-[24.6px]  font-['Metropolis'] mt-2",
                                children: "Von Alltagsbegleitung, Besorgungen und Hauswirtschaft bis hin zu sozialen Aktivitäten wie gemeinsamen Spaziergängen, Vorlesen oder Ausflügen. Auch bei der Grundpflege und der Unterstützung im Alltag stehen wir zuverlässig zur Seite. Alle Leistungen lassen sich flexibel buchen – digital, transparent und individuell auf Ihre Bedürfnisse abgestimmt. So ermöglichen wir unseren Kund:innen mehr Lebensqualität und Sicherheit im eigenen Zuhause – genau so, wie sie es sich wünschen."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 50,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-image222.png",
                        alt: "Senior care",
                        className: "w-full lg:w-1/2 rounded-lg lg:h-[547px] items-start flex justify-start align-top"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 43,
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
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 60,
                                columnNumber: 41
                            }, this),
                            "oder für einen nahen Angehörigen",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 60,
                                columnNumber: 82
                            }, this),
                            " organisieren?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#003588] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-[16px]",
                        children: [
                            "Sie haben das Gefühl, nicht alle Fakten zu kennen und sollen",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 64,
                                columnNumber: 63
                            }, this),
                            " weitreichende und kostspielige Entscheidungen erst noch unter",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 64,
                                columnNumber: 134
                            }, this),
                            " Zeitdruck treffen?",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 64,
                                columnNumber: 162
                            }, this),
                            "Nehmen Sie zuerst mit uns Kontakt auf, bevor Sie einen Entscheid",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 65,
                                columnNumber: 65
                            }, this),
                            " treffen!",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 65,
                                columnNumber: 83
                            }, this),
                            "Registrieren Sie sich und erstellen Sie ihre eigene Offerte direkt",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 66,
                                columnNumber: 67
                            }, this),
                            " und einfach"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 63,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-[#04436F] text-white lg:mt-[60px] px-6 py-3 rounded-full text-[18px] font-medium mt-6 transition duration-300 hover:bg-[#6FCF97]",
                        children: "Jetzt registrieren"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 58,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] px-6 lg:px-4 grid grid-cols-1 lg:grid-cols-2 gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex lg:flex-row flex-col gap-8 lg:gap-0 items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo1test.png",
                                alt: "Care 1",
                                className: "rounded-lg lg:max-w-[230px] w-full lg:mt-[305px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 78,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo2test.png",
                                alt: "Care 2",
                                className: "rounded-lg lg:max-w-[338.25px] w-full  lg:ml-[-120px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 80,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/phc-photo3test.png",
                                alt: "Care 3",
                                className: "rounded-lg lg:max-w-[338.25px] w-full lg:mt-[250px] lg:ml-[-140px]"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 82,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 77,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: [
                                    "Unsere Lösungen für eine optimale Ihre ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 91,
                                        columnNumber: 44
                                    }, this),
                                    "Betreuung – einfach",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 91,
                                        columnNumber: 72
                                    }, this),
                                    " digital organisiert"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 90,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] text-[16px] font-light leading-[24px] font-['Metropolis'] mt-4",
                                children: [
                                    "Wir bei Prime Home Care haben viele Jahre Erfahrung in der professionellen Betreuung von Senioren und pflegebedürftigen Menschen gesammelt. Hand in Hand mit externen Pflegefachleuten, die uns bei der Bedarfsanalyse unterstützen, organisieren wir für Sie und Ihre Angehörigen individuelle und ganzheitliche Betreuungslösungen.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 99,
                                        columnNumber: 78
                                    }, this),
                                    "Wir haben uns zum Ziel gesetzt, unseren Kunden eine umfassende und neutrale Beratung sowie eine nahtlose Organisation rund um das Thema Pflege und Seniorenbetreuung zuhause zu bieten. Im Folgenden stellen wir Ihnen einige unserer Lösungen vor."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 95,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-6 space-y-6",
                                children: [
                                    "Individuelle Pflege-Lösungen",
                                    "Betreuung zuhause",
                                    "Fachkundige Beratung"
                                ].map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center items-center w-[50px] h-[50px]    bg-[#F1F1F1] rounded-full p-[10px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "31",
                                                    height: "31",
                                                    viewBox: "0 0 31 31",
                                                    fill: "none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                            "clip-path": "url(#clip0_1352_2183)",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M10.157 22.7589C7.44348 22.8094 5.25 25.0289 5.25 27.7544V29.2544C5.25 30.0814 5.923 30.7544 6.75 30.7544H23.75C24.577 30.7544 25.25 30.0814 25.25 29.2544V27.7544C25.25 25.0284 23.056 22.8084 20.3415 22.7589C20.1705 22.6974 19.2125 22.2814 18.3945 20.5349C18.651 20.3429 18.886 20.1399 19.0985 19.9264C19.689 20.1399 20.4055 20.2544 21.25 20.2544C22.8525 20.2544 23.7415 19.6819 24.2025 19.2039C24.413 18.9889 24.517 18.6929 24.4875 18.3914C24.458 18.0829 24.2945 17.8044 24.033 17.6239C23.652 17.3689 22.7645 16.4379 22.745 13.3094V13.1604C22.749 11.5469 22.75 10.2274 22.75 9.85987L24.6145 5.6529C24.8735 5.13439 24.752 4.50739 24.3195 4.1274C22.8825 2.86839 19.793 0.754395 15.25 0.754395C10.707 0.754395 7.61748 2.86839 6.1795 4.12789C5.7475 4.50789 5.6265 5.13489 5.8755 5.63289L7.75002 9.86041C7.75002 10.2284 7.75098 11.5469 7.755 13.1594V13.3069C7.7355 16.4384 6.84798 17.3694 6.46098 17.6289C6.205 17.8054 6.0415 18.0834 6.0125 18.3919C5.983 18.6934 6.087 18.9894 6.29502 19.2019C6.75852 19.6824 7.64748 20.2544 9.25002 20.2544C10.0945 20.2544 10.8105 20.1399 11.401 19.9264C11.6135 20.1399 11.8485 20.3434 12.105 20.5349C11.2905 22.2719 10.3235 22.6969 10.157 22.7589ZM24.25 27.7544V29.2544C24.25 29.5304 24.026 29.7544 23.75 29.7544H6.75C6.474 29.7544 6.25002 29.5304 6.25002 29.2544V27.7544C6.25002 25.6444 7.893 23.9154 9.96648 23.7689C10.452 24.5789 12.0515 26.8609 15.113 27.7354C15.158 27.7479 15.204 27.7544 15.25 27.7544C15.296 27.7544 15.3425 27.7479 15.387 27.7354C18.4485 26.8609 20.048 24.5789 20.5335 23.7689C22.607 23.9154 24.25 25.6444 24.25 27.7544ZM19.539 23.4674C19 24.2799 17.62 26.0059 15.25 26.7329C12.8795 26.0059 11.4995 24.2794 10.961 23.4674C11.4885 23.1444 12.278 22.4594 12.953 21.0739C13.338 21.2784 13.759 21.4594 14.2285 21.6024C14.5625 21.7049 14.906 21.7564 15.25 21.7564C15.594 21.7564 15.937 21.7049 16.271 21.6024C16.741 21.4594 17.1615 21.2784 17.547 21.0739C18.222 22.4594 19.011 23.1444 19.539 23.4674ZM23.4765 18.4554L23.755 18.0399L23.4855 18.5079C23.157 18.8489 22.5015 19.2549 21.25 19.2549C20.6995 19.2549 20.214 19.1969 19.798 19.0949C20.849 17.6154 21.1425 15.9694 21.2205 15.1984C21.4415 15.1444 21.65 15.0489 21.841 14.9244C22.1005 17.0694 22.8395 18.0284 23.4765 18.4554ZM8.75148 11.5509C8.75052 10.8894 8.74998 10.3644 8.74998 10.0564C9.462 9.70741 11.7265 8.75437 15.25 8.75437C15.398 8.75437 15.538 8.75989 15.6815 8.76338C14.9305 9.81242 13.279 11.2319 9.82698 11.2544C9.43302 11.2569 9.066 11.3669 8.75148 11.5509ZM21.748 11.5554C21.4305 11.3669 21.061 11.2544 20.6695 11.2544C18.5675 11.2544 17.7515 9.96542 17.4355 8.88241C19.716 9.15439 21.199 9.78638 21.7495 10.0564C21.7495 10.3649 21.749 10.8914 21.748 11.5554ZM6.83952 4.87989C8.17098 3.71239 11.035 1.7544 15.25 1.7544C19.465 1.7544 22.329 3.71239 23.66 4.87989C23.752 4.9599 23.776 5.09439 23.7105 5.22739L22.0075 9.06841C21.046 8.62141 18.732 7.75442 15.25 7.75442C11.768 7.75442 9.45348 8.62141 8.49252 9.06841L6.77952 5.20689C6.72348 5.09389 6.7485 4.9599 6.83952 4.87989ZM7.01502 18.5074L7.02402 18.4554C7.6605 18.0289 8.4 17.0694 8.6595 14.9239C8.85048 15.0484 9.0585 15.1439 9.28002 15.1979C9.35802 15.9689 9.65148 17.6149 10.7025 19.0944C10.287 19.1964 9.80148 19.2544 9.2505 19.2544C7.99902 19.2544 7.344 18.8484 7.01502 18.5074ZM10.2505 14.7534C10.2495 14.4779 10.026 14.2544 9.75048 14.2544C9.47202 14.2544 9.21402 14.1424 9.02298 13.9394C8.838 13.7429 8.74548 13.4864 8.7555 13.2134V13.1809C8.78748 12.6729 9.26952 12.2574 9.834 12.2539C13.745 12.2284 15.649 10.5479 16.522 9.30937C16.935 10.5879 17.989 12.2539 20.6705 12.2539C21.233 12.2539 21.713 12.6694 21.7455 13.1839V13.2159C21.7555 13.4859 21.663 13.7419 21.478 13.9389C21.287 14.1419 21.029 14.2539 20.7505 14.2539C20.475 14.2539 20.2515 14.4774 20.2505 14.7529C20.2505 14.9404 20.185 19.3639 15.979 20.6459C15.503 20.7929 14.9995 20.7929 14.5215 20.6459C10.316 19.3639 10.251 14.9409 10.2505 14.7534Z",
                                                                    fill: "#04436F"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                                    lineNumber: 119,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M13.75 5.25488H14.75V6.25489C14.75 6.53139 14.9735 6.75491 15.25 6.75491C15.5265 6.75491 15.75 6.53139 15.75 6.25489V5.25488H16.75C17.0265 5.25488 17.25 5.03138 17.25 4.75489C17.25 4.47838 17.0265 4.25488 16.75 4.25488H15.75V3.25489C15.75 2.97838 15.5265 2.75488 15.25 2.75488C14.9735 2.75488 14.75 2.97838 14.75 3.25489V4.25488H13.75C13.4735 4.25488 13.25 4.47838 13.25 4.75489C13.25 5.03138 13.4735 5.25488 13.75 5.25488Z",
                                                                    fill: "#04436F"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                                    lineNumber: 120,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                            lineNumber: 118,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                                                id: "clip0_1352_2183",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                    width: "30",
                                                                    height: "30",
                                                                    fill: "white",
                                                                    transform: "translate(0.25 0.754395)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                                    lineNumber: 124,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                                lineNumber: 123,
                                                                columnNumber: 15
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                            lineNumber: 122,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                    lineNumber: 117,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                lineNumber: 115,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#04436F] text-[30px] font-semibold leading-[36px] font-['Instrument Sans']",
                                                children: item
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                lineNumber: 131,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 112,
                                        columnNumber: 9
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 106,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 87,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 74,
                columnNumber: 9
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
                        className: "text-[#04436F] text-[35px] leading-[45px] lg:text-[44px] font-semibold lg:leading-[52.8px]",
                        children: [
                            "Registrieren Sie sich jetzt und erhalten ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 148,
                                columnNumber: 44
                            }, this),
                            "Sie direkt ein individuelles Angebot"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 147,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-[#04436F] w-[140px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] mt-[40px] py-3 px-5 rounded-[50px]",
                        children: "Get started"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 151,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 143,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px]  flex flex-col lg:flex-row items-start gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/phc-containerrr.png",
                        alt: "Care model",
                        className: "lg:h-[500px] w-full lg:w-1/2 rounded-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 text-left px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                                children: "Flexible Betreuungs-Modelle"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2",
                                children: [
                                    "Flexibilität und die Anpassungsfähigkeit an sich wandelnde Bedürfnisse sind wichtige Aspekte bei Wahl der richtigen der Seniorenbetreuung. Unser Modell bietet gegenüber reinen Verleihangeboten mehr Flexibilität, die häusliche Betreuung vertraglich umfassend und zugleich rechtskonform zu regeln.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 169,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 169,
                                        columnNumber: 9
                                    }, this),
                                    "Individuelle Arbeitsverträge können dank unserer Beratung und einer umfassenden juristischen Hilfestellung leichter auf sich im Zeitablauf ändernde Rahmenbedingungen angepasst werden. Zugleich bietet unser Treuhandmodell für unsere Kunden den Komfort, sich für alle Fragen und Wünsche nur an einen Ansprechpartner wenden zu müssen."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 165,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 159,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-[120px] text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']",
                        children: "Häufig gestellte Fragen bei der Betreuungs-Organisation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#04436F] lg:px-[60px] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-3",
                        children: [
                            "Wir haben hier für Sie einige der am häufigsten gestellten Fragen zusammengestellt.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 188,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            "Ihre Frage wurde nicht beantwortet? Warum treten Sie nicht direkt mit uns in Kontakt? Unser",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 190,
                                columnNumber: 10
                            }, this),
                            " Team freut sich, von Ihnen zu hören!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 186,
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
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 205,
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
                                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                            lineNumber: 213,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M16.4443 10.409L11.9999 14.8535L7.5554 10.409",
                                                            stroke: "white",
                                                            strokeWidth: "1.33333",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                            lineNumber: 214,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                    lineNumber: 212,
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
                                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                            lineNumber: 218,
                                                            columnNumber: 15
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                        lineNumber: 217,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                                    lineNumber: 216,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                            lineNumber: 211,
                                            columnNumber: 9
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                        lineNumber: 210,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                                lineNumber: 200,
                                columnNumber: 5
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                        lineNumber: 192,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hausliche-pflege-planen.js",
                lineNumber: 180,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/hausliche-pflege-planen.js",
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
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/hausliche-pflege-planen.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/hausliche-pflege-planen";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/hausliche-pflege-planen.js [client] (ecmascript)");
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
"[project]/src/pages/hausliche-pflege-planen (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/hausliche-pflege-planen.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__789109._.js.map