(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__d777e3._.js", {

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
"[project]/src/data/blogsData.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
const blogsData = [
    {
        id: "1",
        image: "/images/phc-blog1.png",
        category: "Home Care",
        title: "The Importance of Home Care",
        date: "January 24, 2024",
        maintext: "In der Schweiz sind immer mehr Menschen auf Unterstützung im Alltag angewiesen, insbesondere Senioren. Eine professionelle und liebevolle Betreuung spielt dabei eine entscheidende Rolle für ihre Lebensqualität, Selbstständigkeit und soziale Teilhabe. Ob Hilfe im Haushalt, Begleitung bei Freizeitaktivitäten, Gesellschaft leisten oder Unterstützung bei gesundheitlichen Anliegen – die häusliche Betreuung und Begleitung bietet vielfältige Möglichkeiten, um den individuellen Bedürfnissen von Senioren gerecht zu werden. Dabei spielt auch der Umgang mit Demenz und Alzheimer eine wesentliche Rolle. Dieser Ratgeber widmet sich den verschiedenen Aspekten der Betreuung und Begleitung im Alter und gibt Ihnen Antworten auf häufig gestellten Fragen rund um dieses wichtige Thema. Tauchen Sie mit uns ein in die Welt der häuslichen Betreuung und erfahren Sie, wie Sie oder Ihre Angehörigen den Lebensabend so angenehm, sorgenfrei und sicher wie möglich gestalten können.",
        author: {
            id: "author-1",
            name: "John Doe",
            position: "Senior Care Specialist",
            image: "/images/phc-author.png",
            description: "John Doe has 15+ years of experience in home care services. He specializes in elderly care, ensuring comfort and health at home."
        },
        sections: [
            {
                id: "section-1",
                title: "1. What is Home Care?",
                paragraphs: [
                    {
                        id: "para-1-1",
                        text: "Home care is a type of health or personal care service provided at home."
                    },
                    {
                        id: "para-1-2",
                        text: "It includes assistance with daily activities such as bathing, dressing, and medication management."
                    },
                    {
                        id: "tip-1",
                        tip: "Consider hiring a licensed caregiver for professional home care services."
                    },
                    {
                        id: "para-1-3",
                        text: "It is essential for people recovering from illness or living with disabilities."
                    }
                ]
            },
            {
                id: "section-2",
                title: "2. Benefits of Home Care",
                paragraphs: [
                    {
                        id: "para-2-1",
                        text: "Home care promotes independence and allows patients to stay in familiar surroundings."
                    },
                    {
                        id: "para-2-2",
                        text: "It reduces hospital readmissions and improves quality of life."
                    },
                    {
                        id: "tip-2",
                        tip: "Make sure the home environment is safe and accessible to prevent accidents."
                    },
                    {
                        id: "para-2-3",
                        text: "Family members can stay actively involved in their loved one’s care."
                    }
                ]
            },
            {
                id: "section-3",
                title: "3. Who Needs Home Care?",
                paragraphs: [
                    {
                        id: "para-3-1",
                        text: "Elderly individuals who need assistance with daily activities."
                    },
                    {
                        id: "para-3-2",
                        text: "People recovering from surgery or managing chronic illnesses."
                    },
                    {
                        id: "tip-3",
                        tip: "Consult with a healthcare provider to determine the best type of home care."
                    },
                    {
                        id: "para-3-3",
                        text: "Those with disabilities who require specialized support at home."
                    }
                ]
            },
            {
                id: "section-4",
                title: "4. Types of Home Care Services",
                paragraphs: [
                    {
                        id: "para-4-1",
                        text: "Personal care includes help with bathing, dressing, and grooming."
                    },
                    {
                        id: "para-4-2",
                        text: "Medical home care involves skilled nursing, therapy, and medication administration."
                    },
                    {
                        id: "tip-4",
                        tip: "Choose a home care service that matches the patient's specific needs."
                    },
                    {
                        id: "para-4-3",
                        text: "Companion care provides emotional support and helps with errands."
                    }
                ]
            },
            {
                id: "section-5",
                title: "5. How to Choose a Home Care Provider",
                paragraphs: [
                    {
                        id: "para-5-1",
                        text: "Check credentials and certifications of the provider."
                    },
                    {
                        id: "para-5-2",
                        text: "Read reviews and testimonials from other clients."
                    },
                    {
                        id: "tip-5",
                        tip: "Ask for a trial period before committing to long-term home care."
                    },
                    {
                        id: "para-5-3",
                        text: "Ensure the provider offers customized care plans."
                    }
                ]
            },
            {
                id: "section-6",
                title: "6. Costs and Insurance for Home Care",
                paragraphs: [
                    {
                        id: "para-6-1",
                        text: "Home care costs vary based on services and duration."
                    },
                    {
                        id: "para-6-2",
                        text: "Some insurance plans and government programs cover home care expenses."
                    },
                    {
                        id: "tip-6",
                        tip: "Research financial assistance options to reduce out-of-pocket costs."
                    },
                    {
                        id: "para-6-3",
                        text: "Discuss costs upfront to avoid unexpected charges."
                    }
                ]
            },
            {
                id: "section-7",
                title: "7. Common Myths About Home Care",
                paragraphs: [
                    {
                        id: "para-7-1",
                        text: "Myth: Home care is only for elderly people."
                    },
                    {
                        id: "para-7-2",
                        text: "Fact: People of all ages can benefit from home care services."
                    },
                    {
                        id: "tip-7",
                        tip: "Educate yourself on home care options to make informed decisions."
                    },
                    {
                        id: "para-7-3",
                        text: "Myth: Home care is more expensive than nursing homes."
                    }
                ]
            },
            {
                id: "section-8",
                title: "8. How to Transition to Home Care",
                paragraphs: [
                    {
                        id: "para-8-1",
                        text: "Start with a gradual introduction to home care services."
                    },
                    {
                        id: "para-8-2",
                        text: "Involve family members and caregivers in the transition process."
                    },
                    {
                        id: "tip-8",
                        tip: "Maintain open communication to ensure a smooth transition."
                    },
                    {
                        id: "para-8-3",
                        text: "Set realistic expectations and goals for home care support."
                    }
                ]
            },
            {
                id: "section-9",
                title: "9. The Role of Family in Home Care",
                paragraphs: [
                    {
                        id: "para-9-1",
                        text: "Family members provide emotional and physical support."
                    },
                    {
                        id: "para-9-2",
                        text: "They coordinate with caregivers to ensure proper care."
                    },
                    {
                        id: "tip-9",
                        tip: "Consider joining a family caregiver support group for guidance."
                    },
                    {
                        id: "para-9-3",
                        text: "Family involvement improves the overall quality of home care."
                    }
                ]
            },
            {
                id: "section-10",
                title: "10. Home Care FAQs",
                title2: "Wichtige Aspekte der Betreuung im Alter",
                faqs: [
                    {
                        id: "faq-10-1",
                        question: "What qualifications should a home caregiver have?",
                        answer: "They should be licensed, experienced, and have CPR training."
                    },
                    {
                        id: "faq-10-2",
                        question: "How often should home care services be provided?",
                        answer: "It depends on the patient’s needs—daily, weekly, or as needed."
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        image: "/images/blog2.png",
        category: "Health",
        title: "Healthy Aging: Lifestyle Tips for Seniors",
        date: "January 24, 2024",
        content: "This blog discusses healthy aging tips for seniors..."
    },
    {
        id: "3",
        image: "/images/blog3.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: "4",
        image: "/images/blog4.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 5,
        image: "/images/blog5.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 6,
        image: "/images/blog6.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 7,
        image: "/images/blog7.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 8,
        image: "/images/blog8.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 9,
        image: "/images/blog9.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 10,
        image: "/images/blog10.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 11,
        image: "/images/blog11.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 12,
        image: "/images/blog12.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 13,
        image: "/images/blog12.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    },
    {
        id: 14,
        image: "/images/blog12.png",
        category: "Medication",
        title: "Tips for Managing Medications at Home",
        date: "January 24, 2024",
        content: "Learn how to manage medications effectively at home..."
    }
];
const __TURBOPACK__default__export__ = blogsData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/pages/blog/[id].js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>BlogPost)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$blogsData$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/data/blogsData.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
;
;
function BlogPost() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [faqOpen, setFaqOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // Add FAQ open state
    const { id } = router.query;
    const [recommendedBlogs, setRecommendedBlogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const sectionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // Find the current blog post by ID
    const blog = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$blogsData$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].find((blog)=>blog.id === id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlogPost.useEffect": ()=>{
            window.scrollTo(0, 0); // Ensure page loads at the top
        }
    }["BlogPost.useEffect"], []);
    const scrollToSection = (index)=>{
        sectionsRef.current[index]?.scrollIntoView({
            behavior: "smooth"
        });
    };
    // Generate Recommended Blogs
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlogPost.useEffect": ()=>{
            if (blog) {
                const filteredBlogs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$blogsData$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].filter({
                    "BlogPost.useEffect.filteredBlogs": (b)=>b.id !== id
                }["BlogPost.useEffect.filteredBlogs"]); // Exclude current blog
                const shuffledBlogs = filteredBlogs.sort({
                    "BlogPost.useEffect.shuffledBlogs": ()=>0.5 - Math.random()
                }["BlogPost.useEffect.shuffledBlogs"]); // Shuffle list
                setRecommendedBlogs(shuffledBlogs.slice(0, 3)); // Select 3 random blogs
            }
        }
    }["BlogPost.useEffect"], [
        blog,
        id
    ]);
    // If blog not found, show a 404 message
    if (!blog) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mt-20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-[#04436F] text-[30px] font-semibold",
                    children: "Blog Not Found"
                }, void 0, false, {
                    fileName: "[project]/src/pages/blog/[id].js",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600",
                    children: "Sorry, we couldn't find the blog you're looking for."
                }, void 0, false, {
                    fileName: "[project]/src/pages/blog/[id].js",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/BlogPage",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "mt-4 px-6 py-2 bg-[#04436F] text-white rounded-full",
                        children: "Back to Blogs"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/blog/[id].js",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/blog/[id].js",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-[1410px] mx-auto px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 mt-[50px] lg:grid-cols-2 gap-8 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[#003588] font-['Instrument Sans'] text-[64px] font-semibold leading-[72px] mt-10",
                                children: blog.title
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 55,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-black mt-2",
                                children: [
                                    blog.date,
                                    " | ",
                                    blog.category
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            blog.maintext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#04436F] font-['Metropolis'] text-[16px] font-light leading-[24px] mt-6",
                                children: blog.maintext
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-row gap-[8px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "mt-6 px-6 py-3 bg-[#04436F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[21.6px]    underline rounded-[100px] flex items-center gap-2 hover:bg-[#033559] transition",
                                        onClick: ()=>scrollToSection(0),
                                        children: [
                                            "Unten weiterlesen",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "16",
                                                    height: "22",
                                                    viewBox: "0 0 16 22",
                                                    fill: "none",
                                                    className: "ml-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                            "clip-path": "url(#clip0_1541_6690)",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M7.75 1L7.75 21M7.75 21L1.5 14.75M7.75 21L14 14.75",
                                                                stroke: "white",
                                                                "stroke-width": "1.5",
                                                                "stroke-linecap": "round",
                                                                "stroke-linejoin": "round"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog/[id].js",
                                                                lineNumber: 78,
                                                                columnNumber: 5
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 77,
                                                            columnNumber: 3
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                                                id: "clip0_1541_6690",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                    width: "22",
                                                                    height: "15",
                                                                    fill: "white",
                                                                    transform: "translate(0.5 22) rotate(-90)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                                    lineNumber: 82,
                                                                    columnNumber: 7
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog/[id].js",
                                                                lineNumber: 81,
                                                                columnNumber: 5
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 80,
                                                            columnNumber: 3
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 76,
                                                    columnNumber: 3
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog/[id].js",
                                                lineNumber: 75,
                                                columnNumber: 3
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 69,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-6 px-6 py-3 bg-[#B99B5F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[20px]    rounded-[100px] flex items-center hover:bg-[#033559] transition",
                                        children: [
                                            blog.category,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                fileName: "[project]/src/pages/blog/[id].js",
                                                lineNumber: 94,
                                                columnNumber: 3
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 90,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 67,
                                columnNumber: 1
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: blog.image,
                        alt: blog.title,
                        className: "w-full rounded-[20px] lg:h-[580px] mt-2"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog/[id].js",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-[120px] flex flex-col lg:flex-row items-start gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/3 bg-white p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: blog.author.image,
                                alt: blog.author.name,
                                className: "w-[393px] h-[388px] mx-auto mt-6"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 110,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col p-[30px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-left font-['Instrument Sans'] text-[#04436F] text-[22px] font-medium leading-[26.4px]",
                                        children: blog.author.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 116,
                                        columnNumber: 1
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-left font-['Inter'] text-[#04436F] text-[16px] font-normal leading-[25.6px]",
                                        children: blog.author.position
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 119,
                                        columnNumber: 1
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 lg:mt-[40px] text-left font-['Inter'] text-[#04436F] text-[16px] font-normal leading-[25.6px]",
                                        children: blog.author.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 122,
                                        columnNumber: 1
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 115,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 109,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-2/3  p-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-3",
                            children: blog.sections.map((section, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "cursor-pointer flex justify-between items-center bg-[#EDF2FB] p-4 rounded-[12px]",
                                    onClick: ()=>scrollToSection(index),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline",
                                            children: section.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 137,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "24",
                                            height: "26",
                                            viewBox: "0 0 24 26",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    "clip-path": "url(#clip0_1352_2701)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z",
                                                            fill: "#04436F"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 143,
                                                            columnNumber: 5
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481",
                                                            stroke: "white",
                                                            "stroke-width": "1.33333",
                                                            "stroke-linecap": "round",
                                                            "stroke-linejoin": "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 144,
                                                            columnNumber: 5
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 142,
                                                    columnNumber: 3
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                                        id: "clip0_1352_2701",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            width: "24",
                                                            height: "25",
                                                            fill: "white",
                                                            transform: "matrix(-1 0 0 -1 24 25.1699)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 148,
                                                            columnNumber: 7
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/blog/[id].js",
                                                        lineNumber: 147,
                                                        columnNumber: 5
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 146,
                                                    columnNumber: 3
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 141,
                                            columnNumber: 1
                                        }, this)
                                    ]
                                }, section.id, true, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 132,
                                    columnNumber: 9
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/blog/[id].js",
                            lineNumber: 130,
                            columnNumber: 5
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 129,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog/[id].js",
                lineNumber: 106,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1410px] mx-auto px-4",
                children: blog && blog.sections && blog.sections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1410px] mx-auto px-4",
                    children: blog.sections.map((section, sectionIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: (el)=>sectionsRef.current[sectionIndex] = el,
                            className: "space-y-[24px] mt-12 lg:mt-[120px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[#003588] font-['Metropolis'] text-[40px] font-semibold leading-[48px]",
                                    children: [
                                        sectionIndex + 1,
                                        ". ",
                                        section.title
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 169,
                                    columnNumber: 9
                                }, this),
                                section.title2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[#003588] font-['Metropolis'] text-[24px] font-[400] leading-[25.6px]",
                                    children: section.title2
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 175,
                                    columnNumber: 11
                                }, this),
                                section.paragraphs && Array.isArray(section.paragraphs) && section.paragraphs.length > 0 ? section.paragraphs.map((paragraph, paragraphIndex)=>paragraph.tip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 flex flex-col justify-start items-start bg-[#F1F1F1] text-[#04436F] lg:py-[30px] lg:px-[80px] font-['Inter'] text-[16px] font-normal leading-[25.6px] mt-2 rounded-[20px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-[#04436F] text-center font-['Instrument Sans'] text-[44px] font-semibold leading-[52.8px]",
                                                children: "TIP:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog/[id].js",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            paragraph.tip
                                        ]
                                    }, paragraph.id, true, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-[#04436F] font-['Metropolis'] text-[16px] font-normal leading-[24px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold",
                                                children: [
                                                    sectionIndex + 1,
                                                    ".",
                                                    paragraphIndex + 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/blog/[id].js",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            paragraph.text
                                        ]
                                    }, paragraph.id, true, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 197,
                                    columnNumber: 11
                                }, this),
                                section.faqs && Array.isArray(section.faqs) && section.faqs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-10 space-y-4",
                                    children: section.faqs.map((faq, faqIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#EDF2FB] p-4 rounded-[12px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "w-full flex justify-between items-center text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline",
                                                    onClick: ()=>setFaqOpen(faqOpen === faqIndex ? null : faqIndex),
                                                    children: [
                                                        faq.question,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: "24",
                                                            height: "26",
                                                            viewBox: "0 0 24 26",
                                                            fill: "none",
                                                            className: `transform transition-transform ${faqOpen === faqIndex ? "rotate-180" : ""}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                                    clipPath: "url(#clip0_1352_2701)",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z",
                                                                            fill: "#04436F"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                                            lineNumber: 219,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481",
                                                                            stroke: "white",
                                                                            strokeWidth: "1.33333",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                                            lineNumber: 223,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                                    lineNumber: 218,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                                                        id: "clip0_1352_2701",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                            width: "24",
                                                                            height: "25",
                                                                            fill: "white",
                                                                            transform: "matrix(-1 0 0 -1 24 25.1699)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                                            lineNumber: 233,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/blog/[id].js",
                                                                        lineNumber: 232,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                                    lineNumber: 231,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog/[id].js",
                                                            lineNumber: 210,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, this),
                                                faqOpen === faqIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-3 text-[#04436F] font-['Metropolis'] text-[16px] font-normal leading-[24px]",
                                                    children: faq.answer
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, faq.id, true, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 202,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, section.id, true, {
                            fileName: "[project]/src/pages/blog/[id].js",
                            lineNumber: 166,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/pages/blog/[id].js",
                    lineNumber: 164,
                    columnNumber: 3
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/blog/[id].js",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1410px] mx-auto mt-[120px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[40px] leading-[48px] font-[600] text-[#04436F] text-left",
                        children: "Passende Themen"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6",
                        children: recommendedBlogs.map((blog)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/blog/${blog.id}`,
                                passHref: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: blog.image,
                                            alt: blog.title,
                                            className: "w-full h-[300px]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 271,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-row justify-between mt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-[#04436F] text-[14px] text-center justify-center flex font-[400] leading-[25px] px-4 py-2 rounded-l-[20px] relative",
                                                    style: {
                                                        background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)",
                                                        padding: "4px 12px"
                                                    },
                                                    children: blog.category
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 273,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#04436F] text-[14px] font-[400] leading-[25px]",
                                                    children: blog.date
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog/[id].js",
                                                    lineNumber: 283,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 272,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[#04436F] text-[26px] leading-[33px] font-[600] mt-2",
                                            children: blog.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog/[id].js",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, this),
                                        "              "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog/[id].js",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this)
                            }, blog.id, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 268,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog/[id].js",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-[#EDF2FB] rounded-[20px] py-[100px] px-[20px] mt-[120px] mb-[120px] max-w-[1430px] mx-auto flex flex-col lg:flex-row items-center gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 gap-[60px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[#003588] font-['Metropolis'] text-[40px] font-semibold leading-[48px]",
                                children: [
                                    "Geld sparen bei Betreuung",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 298,
                                        columnNumber: 28
                                    }, this),
                                    " zuhause: Beteiligen Sie Ihre ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/blog/[id].js",
                                        lineNumber: 298,
                                        columnNumber: 67
                                    }, this),
                                    " Krankenkasse an den Kosten!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 297,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#003588] font-['Metropolis'] text-[24px] font-normal leading-[32px] mt-2",
                                children: "Mit unserer Hilfe können Sie bei der Betreuung zuhause viel Geld einsparen. Übernimmt anstelle der regulären Spitex eine zertifizierte Live-In-Betreuungskraft die Aufgaben bei der Grundpflege, können diese Leistungen in vielen Kantonen mit der Krankenkasse abgerechnet werden. Die Aufsicht über die Pflegetätigkeit sowie die Abrechnung der geleisteten Stunden mit den Krankenkassen übernehmen spezialisierte und bewilligte Partner. Gegenüber den üblichen Verleih-Lösungen bei der Betreuung zuhause können Sie Monat für Monat oft mehrere Tausend Franken einsparen."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 302,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "mt-6 lg:mt-[60px] px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF]    font-['Inter'] text-[18px] font-medium leading-[21.6px]    rounded-[50px] flex items-center justify-center    hover:bg-[#033559] transition    underline decoration-solid decoration-auto underline-offset-auto",
                                children: "Kostenlose Pflegeberatung sichern"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog/[id].js",
                                lineNumber: 314,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 296,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-1/2 flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/hero-image-phc.png",
                            alt: "Happy Elderly Woman",
                            className: "w-full max-w-[600px] rounded-[12px]"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/blog/[id].js",
                            lineNumber: 326,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog/[id].js",
                        lineNumber: 325,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog/[id].js",
                lineNumber: 294,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/blog/[id].js",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(BlogPost, "W07Vpe1gswaLSpIfHabf54h0FuM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BlogPost;
var _c;
__turbopack_refresh__.register(_c, "BlogPost");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog/[id].js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/blog/[id]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/blog/[id].js [client] (ecmascript)");
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
"[project]/src/pages/blog/[id].js (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog/[id].js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__d777e3._.js.map