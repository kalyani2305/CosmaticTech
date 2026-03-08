/**
 * Create an admin user. Run from server folder: node scripts/createAdmin.js
 * Usage: node scripts/createAdmin.js <email> <password>
 * Example: node scripts/createAdmin.js admin@glow.cosmetics admin123
 */
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const email = process.argv[2] || 'admin@glow.cosmetics';
const password = process.argv[3] || 'admin123';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function main() {
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ name: 'Admin', email, password_hash, role: 'admin' })
    .select('id, email, role')
    .single();

  if (error) {
    if (error.code === '23505') {
      console.log('User with this email already exists. Update role to admin in Supabase if needed.');
    } else {
      console.error(error);
    }
    process.exit(1);
  }
  console.log('Admin created:', data);
}

main();
