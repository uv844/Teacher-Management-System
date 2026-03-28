
-- Create auth_user table
CREATE TABLE IF NOT EXISTS auth_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    university_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    year_joined INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) - Optional but recommended for Supabase
ALTER TABLE auth_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Simple policies for demonstration (adjust as needed for production)
CREATE POLICY "Allow all for service role" ON auth_user FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON teachers FOR ALL USING (true);
