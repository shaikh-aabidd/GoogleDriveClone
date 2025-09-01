import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const connectDB = async (): Promise<void> => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log("Supabase Connection Failed: ", error);
      process.exit(1);
    }
    
    console.log(`\nSupabase connected successfully!`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.log("Database Connection Failed: ", error);
    process.exit(1);
  }
};

export { supabase, connectDB };
