import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Subscription from '../models/subscription.model.js';
import ResourceGroup from '../models/resourceGroup.model.js';
import ResourceType from '../models/resourceType.model.js';
import Region from '../models/region.model.js';
import HardwareProfile from '../models/hardwareProfile.model.js';
import TagSuggestion from '../models/tagSuggestion.model.js';

// Seed definitions for the 6 lookup collections
const SUBSCRIPTIONS = [
  { name: 'Free', status: 'active' },
  { name: 'Pro', status: 'active' },
  { name: 'Enterprise', status: 'active' }
];

const RESOURCE_GROUPS = [
  { name: 'rg-production', subscriptionName: 'Enterprise', status: 'active' },
  { name: 'rg-staging', subscriptionName: 'Pro', status: 'active' },
  { name: 'rg-development', subscriptionName: 'Free', status: 'active' }
];

const RESOURCE_TYPES = [
  { name: 'Virtual Machine', status: 'active' },
  { name: 'Database', status: 'active' },
  { name: 'Storage', status: 'active' },
  { name: 'Function', status: 'active' }
];

const REGIONS = [
  { name: 'Mumbai', status: 'active' },
  { name: 'Delhi', status: 'active' },
  { name: 'Singapore', status: 'active' },
  { name: 'East US', status: 'active' }
];

const HARDWARE_PROFILES = [
  {
    name: 'Standard B2s (Burstable)',
    code: 'standard-b2s',
    cpu: 2,
    ramGb: 4,
    status: 'active'
  },
  {
    name: 'Standard D4s v5 (Balanced)',
    code: 'standard-d4s-v5',
    cpu: 4,
    ramGb: 16,
    status: 'active'
  },
  {
    name: 'Standard D8s v5 (Compute Heavy)',
    code: 'standard-d8s-v5',
    cpu: 8,
    ramGb: 32,
    status: 'active'
  },
  {
    name: 'Standard E8s v5 (Memory Optimized)',
    code: 'standard-e8s-v5',
    cpu: 8,
    ramGb: 64,
    status: 'active'
  }
];

const TAG_SUGGESTIONS = [
  { key: 'Environment', value: 'Production', isActive: true },
  { key: 'CostCenter', value: 'Platform-Engineering', isActive: true },
  { key: 'SecurityCompliance', value: 'SOC2-TypeII', isActive: true },
  { key: 'BackupPolicy', value: 'Daily-30d-Retention', isActive: true }
];

/**
 * Seeds the lookup collections idempotently.
 * Running this function multiple times will not create duplicates.
 */
export const seedLookup = async () => {
  console.log('🌱 Starting lookup data seeding...');

  // 1. Seed Subscriptions
  console.log('\n--- Seeding Subscriptions ---');
  const subscriptionMap = new Map();
  for (const item of SUBSCRIPTIONS) {
    const sub = await Subscription.findOneAndUpdate(
      { name: item.name },
      { $set: { name: item.name, status: item.status } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    subscriptionMap.set(sub.name, sub);
    console.log(`  ✓ Subscription: "${sub.name}" (ID: ${sub._id}, status: ${sub.status})`);
  }

  // 2. Seed Resource Groups (each references a valid seeded Subscription via subscriptionId)
  console.log('\n--- Seeding Resource Groups ---');
  const resourceGroupResults = [];
  for (const item of RESOURCE_GROUPS) {
    const targetSub = subscriptionMap.get(item.subscriptionName);
    if (!targetSub) {
      throw new Error(`Referenced subscription "${item.subscriptionName}" not found`);
    }

    const rg = await ResourceGroup.findOneAndUpdate(
      { name: item.name },
      {
        $set: {
          name: item.name,
          subscriptionId: targetSub._id,
          status: item.status
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    resourceGroupResults.push(rg);
    console.log(
      `  ✓ ResourceGroup: "${rg.name}" (ID: ${rg._id}, subscriptionId: ${rg.subscriptionId}, status: ${rg.status})`
    );
  }

  // 3. Seed Resource Types
  console.log('\n--- Seeding Resource Types ---');
  const resourceTypeResults = [];
  for (const item of RESOURCE_TYPES) {
    const rt = await ResourceType.findOneAndUpdate(
      { name: item.name },
      { $set: { name: item.name, status: item.status } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    resourceTypeResults.push(rt);
    console.log(`  ✓ ResourceType: "${rt.name}" (ID: ${rt._id}, status: ${rt.status})`);
  }

  // 4. Seed Regions
  console.log('\n--- Seeding Regions ---');
  const regionResults = [];
  for (const item of REGIONS) {
    const r = await Region.findOneAndUpdate(
      { name: item.name },
      { $set: { name: item.name, status: item.status } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    regionResults.push(r);
    console.log(`  ✓ Region: "${r.name}" (ID: ${r._id}, status: ${r.status})`);
  }

  // 5. Seed Hardware Profiles
  console.log('\n--- Seeding Hardware Profiles ---');
  const hardwareProfileResults = [];
  for (const item of HARDWARE_PROFILES) {
    const hp = await HardwareProfile.findOneAndUpdate(
      { code: item.code },
      { $set: item },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    hardwareProfileResults.push(hp);
    console.log(
      `  ✓ HardwareProfile: "${hp.name}" (${hp.code}, ${hp.cpu} vCPU, ${hp.ramGb} GB RAM, status: ${hp.status})`
    );
  }

  // 6. Seed Tag Suggestions
  console.log('\n--- Seeding Tag Suggestions ---');
  const tagSuggestionResults = [];
  for (const item of TAG_SUGGESTIONS) {
    const ts = await TagSuggestion.findOneAndUpdate(
      { key: item.key, value: item.value },
      { $set: item },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    tagSuggestionResults.push(ts);
    console.log(
      `  ✓ TagSuggestion: "${ts.key}": "${ts.value}" (isActive: ${ts.isActive})`
    );
  }

  console.log('\n✅ All 6 lookup collections seeded successfully.');

  return {
    subscriptions: Array.from(subscriptionMap.values()),
    resourceGroups: resourceGroupResults,
    resourceTypes: resourceTypeResults,
    regions: regionResults,
    hardwareProfiles: hardwareProfileResults,
    tagSuggestions: tagSuggestionResults
  };
};

/**
 * Entry point when run as a standalone script.
 */
const run = async () => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection is not established. Check MONGO_URI in .env.');
    }
    await seedLookup();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
    }
    process.exit(process.exitCode || 0);
  }
};

const isDirectRun =
  process.argv[1] &&
  (fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
    path.resolve(process.argv[1]).endsWith(path.join('src', 'seeds', 'lookup.seed.js')));

if (isDirectRun) {
  run();
}
