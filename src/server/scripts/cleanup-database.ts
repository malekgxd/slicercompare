/**
 * Database Cleanup Script
 * Deletes all corrupted sessions with filesystem paths
 * Run with: npx tsx src/server/scripts/cleanup-database.ts
 */

import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Step 1: Delete all results
    console.log('1️⃣ Deleting all results...');
    const { error: resultsError, count: resultsCount } = await supabase
      .from('results')
      .delete()
      .neq('result_id', '00000000-0000-0000-0000-000000000000'); // Match all rows

    if (resultsError) {
      console.error('❌ Failed to delete results:', resultsError.message);
      throw resultsError;
    }
    console.log(`✅ Deleted ${resultsCount ?? 'all'} results\n`);

    // Step 2: Delete all configurations
    console.log('2️⃣ Deleting all configurations...');
    const { error: configsError, count: configsCount } = await supabase
      .from('configurations')
      .delete()
      .neq('config_id', '00000000-0000-0000-0000-000000000000'); // Match all rows

    if (configsError) {
      console.error('❌ Failed to delete configurations:', configsError.message);
      throw configsError;
    }
    console.log(`✅ Deleted ${configsCount ?? 'all'} configurations\n`);

    // Step 3: Delete all comparison_sessions
    console.log('3️⃣ Deleting all comparison sessions...');
    const { error: sessionsError, count: sessionsCount } = await supabase
      .from('comparison_sessions')
      .delete()
      .neq('session_id', '00000000-0000-0000-0000-000000000000'); // Match all rows

    if (sessionsError) {
      console.error('❌ Failed to delete sessions:', sessionsError.message);
      throw sessionsError;
    }
    console.log(`✅ Deleted ${sessionsCount ?? 'all'} sessions\n`);

    // Verify cleanup
    console.log('4️⃣ Verifying cleanup...');
    const { count: remainingResults } = await supabase
      .from('results')
      .select('*', { count: 'exact', head: true });

    const { count: remainingConfigs } = await supabase
      .from('configurations')
      .select('*', { count: 'exact', head: true });

    const { count: remainingSessions } = await supabase
      .from('comparison_sessions')
      .select('*', { count: 'exact', head: true });

    console.log('\n📊 Cleanup Summary:');
    console.log(`  - Results remaining: ${remainingResults ?? 0}`);
    console.log(`  - Configurations remaining: ${remainingConfigs ?? 0}`);
    console.log(`  - Sessions remaining: ${remainingSessions ?? 0}`);

    if (remainingResults === 0 && remainingConfigs === 0 && remainingSessions === 0) {
      console.log('\n✅ Database cleanup complete! All tables are empty.');
      console.log('\n📝 Next steps:');
      console.log('  1. Go to http://localhost:5173');
      console.log('  2. Create a BRAND NEW session');
      console.log('  3. Upload a file');
      console.log('  4. Create 2 configurations');
      console.log('  5. Run comparison');
      console.log('  6. Verify results save successfully');
    } else {
      console.log('\n⚠️ Warning: Some rows still remain in the database');
    }

  } catch (error: any) {
    console.error('\n❌ Cleanup failed:', error.message);
    logger.error('cleanup', 'Database cleanup failed', { error: error.message });
    process.exit(1);
  }
}

// Run cleanup
cleanupDatabase();
