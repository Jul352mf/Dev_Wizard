import { promises as fs } from 'fs';
import { z, ZodIssue } from 'zod';

const FeatureSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
}).strict();

const FeatureFileSchema = z.object({
  features: z.record(FeatureSchema),
  environment: z.string(),
  version: z.string(),
}).strict();

export type FeatureFlags = z.infer<typeof FeatureFileSchema>;

let cache: { data: FeatureFlags; mtimeMs: number } | null = null;

// Build a robust search list that works whether cwd is repo root or dev_wizard/ subdir
const cwd = process.cwd().replace(/\\/g, '/');
const CANDIDATE_FILES = Array.from(new Set([
  'dev_wizard/config/features.json',
  'dev_wizard/config/features.example.json',
  'config/features.json',
  'config/features.example.json',
  `${cwd.endsWith('/dev_wizard') ? '' : 'dev_wizard/' }config/features.json`,
  `${cwd.endsWith('/dev_wizard') ? '' : 'dev_wizard/' }config/features.example.json`,
]));

function firstExisting(paths: string[]): Promise<string | null> {
  return Promise.all(paths.map(async p => {
    try { await fs.access(p); return p; } catch { return null; }
  })).then(results => results.find(Boolean) ?? null);
}

export async function loadFeatureFlags(): Promise<FeatureFlags> {
  const file = await firstExisting(CANDIDATE_FILES);
  if (!file) {
    throw new Error('No feature flags file found. Expected one of: ' + CANDIDATE_FILES.join(', '));
  }
  const stat = await fs.stat(file);
  if (cache && cache.mtimeMs === stat.mtimeMs) {
    return cache.data;
  }
  const raw = await fs.readFile(file, 'utf-8');
  let json: unknown;
  try { json = JSON.parse(raw); } catch (e) { throw new Error(`Invalid JSON in ${file}: ${(e as Error).message}`); }
  const parsed = FeatureFileSchema.safeParse(json);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i: ZodIssue) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error('Feature flags validation failed: ' + issues);
  }
  cache = { data: parsed.data, mtimeMs: stat.mtimeMs };
  return parsed.data;
}

export async function getEnabledFeatures(): Promise<string[]> {
  const flags = await loadFeatureFlags();
  return Object.entries(flags.features)
    .filter(([, v]) => v.enabled)
    .map(([k]) => k)
    .sort();
}
