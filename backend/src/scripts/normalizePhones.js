require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Reuse the same normalization logic as in authRoutes.js
function normalizePhone(phone) {
  if (!phone) return null;
  let cleaned = String(phone).trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    const digits = cleaned.replace(/[^\d]/g, '');
    return `+${digits}`;
  }
  if (cleaned.startsWith('00')) {
    const digits = cleaned.slice(2).replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    const digits = cleaned.slice(1);
    if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  }
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  if (cleaned.length >= 11 && cleaned.length <= 15 && /^\d+$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return null;
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log('Connected to Mongo');

  const users = await User.find({}, { phone: 1, isProfileComplete: 1, updatedAt: 1, createdAt: 1, name: 1 }).lean();
  console.log(`Loaded ${users.length} users`);

  let updates = 0;
  const byPhone = new Map();

  for (const u of users) {
    const normalized = normalizePhone(u.phone);
    if (!normalized) {
      console.warn(`Skipping user ${u._id} with invalid phone: ${u.phone}`);
      continue;
    }
    if (normalized !== u.phone) {
      await User.updateOne({ _id: u._id }, { $set: { phone: normalized } });
      updates++;
    }
    const list = byPhone.get(normalized) || [];
    list.push(u);
    byPhone.set(normalized, list);
  }

  console.log(`Normalized ${updates} phone values`);

  // Detect duplicates
  const duplicates = [];
  for (const [phone, list] of byPhone.entries()) {
    if (list.length > 1) {
      duplicates.push({ phone, users: list });
    }
  }

  if (duplicates.length === 0) {
    console.log('No duplicate phone numbers found after normalization.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${duplicates.length} duplicate phone sets:`);
  for (const dup of duplicates) {
    console.log(`\nPhone: ${dup.phone}`);
    dup.users.forEach(u => {
      console.log(`  - _id: ${u._id}, name: ${u.name || ''}, complete: ${u.isProfileComplete}, updatedAt: ${u.updatedAt}`);
    });
  }

  if (String(process.env.CONFIRM_DELETE).toLowerCase() !== 'true') {
    console.log('\nSet CONFIRM_DELETE=true and re-run to auto-resolve duplicates by keeping the best candidate.');
    await mongoose.disconnect();
    return;
  }

  // Auto-resolve: keep best candidate, delete others
  let deleted = 0;
  for (const dup of duplicates) {
    // Choose best: prefer isProfileComplete === true, then most recent updatedAt
    const sorted = dup.users.slice().sort((a, b) => {
      if (a.isProfileComplete !== b.isProfileComplete) return (b.isProfileComplete ? 1 : 0) - (a.isProfileComplete ? 1 : 0);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    const keep = sorted[0];
    const remove = sorted.slice(1);
    for (const r of remove) {
      await User.deleteOne({ _id: r._id });
      deleted++;
    }
    console.log(`Resolved ${dup.phone}: kept ${keep._id}, removed ${remove.map(r => r._id).join(', ')}`);
  }

  console.log(`Deleted ${deleted} duplicate users.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
