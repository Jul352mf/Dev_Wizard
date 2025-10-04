"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFeatureFlags = loadFeatureFlags;
exports.getEnabledFeatures = getEnabledFeatures;
const fs_1 = require("fs");
const zod_1 = require("zod");
// Zod schema mirroring features.schema.json for runtime validation
const FeatureSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    description: zod_1.z.string(),
}).strict();
const FeatureFileSchema = zod_1.z.object({
    features: zod_1.z.record(FeatureSchema),
    environment: zod_1.z.string(),
    version: zod_1.z.string(),
}).strict();
let cache = null;
const CANDIDATE_FILES = [
    'dev_wizard/config/features.json',
    'dev_wizard/config/features.example.json',
];
function firstExisting(paths) {
    return Promise.all(paths.map(async (p) => {
        try {
            await fs_1.promises.access(p);
            return p;
        }
        catch {
            return null;
        }
    })).then(results => results.find(Boolean) ?? null);
}
async function loadFeatureFlags() {
    const file = await firstExisting(CANDIDATE_FILES);
    if (!file) {
        throw new Error('No feature flags file found. Expected one of: ' + CANDIDATE_FILES.join(', '));
    }
    const stat = await fs_1.promises.stat(file);
    if (cache && cache.mtimeMs === stat.mtimeMs) {
        return cache.data;
    }
    const raw = await fs_1.promises.readFile(file, 'utf-8');
    let json;
    try {
        json = JSON.parse(raw);
    }
    catch (e) {
        throw new Error(`Invalid JSON in ${file}: ${e.message}`);
    }
    const parsed = FeatureFileSchema.safeParse(json);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error('Feature flags validation failed: ' + issues);
    }
    cache = { data: parsed.data, mtimeMs: stat.mtimeMs };
    return parsed.data;
}
async function getEnabledFeatures() {
    const flags = await loadFeatureFlags();
    return Object.entries(flags.features)
        .filter(([, v]) => v.enabled)
        .map(([k]) => k)
        .sort();
}
