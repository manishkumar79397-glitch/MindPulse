-- ============================================================================
-- MANSAATHI DATABASE SCHEMA (Supabase / PostgreSQL)
-- AI-Based Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PATIENTS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    age INT CHECK (age >= 0),
    preferred_language VARCHAR(50) DEFAULT 'hi', -- 'hi', 'en', 'as', 'mni', 'kha'
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CAREGIVERS TABLE
CREATE TABLE IF NOT EXISTS caregivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(100), -- 'Daughter', 'Son', 'Spouse', 'Professional Caregiver'
    auth_user_id UUID, -- Links to Supabase Auth uid if registered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GAMES CATALOG TABLE
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(100) PRIMARY KEY,
    game_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'memory', 'sequencing', 'matching', 'cultural', 'motor'
    description TEXT,
    supported_languages TEXT[] DEFAULT ARRAY['hi', 'en', 'as'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GAME SESSIONS TABLE (For Engagement & Difficulty Tracking)
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    game_id VARCHAR(100) REFERENCES games(id) NOT NULL,
    difficulty INT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 4),
    accuracy NUMERIC(5, 2) NOT NULL, -- 0.0 to 1.0 (e.g. 0.85 = 85%)
    completion_rate NUMERIC(5, 2) NOT NULL, -- 0.0 to 1.0
    response_time_seconds NUMERIC(6, 2), -- Average response time per item in seconds
    engagement_score NUMERIC(5, 2), -- Calculated product engagement metric
    hints_used INT DEFAULT 0,
    language_used VARCHAR(50) DEFAULT 'hi',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. REMINDERS & ROUTINES TABLE
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_of_day TIME NOT NULL, -- e.g. '08:00:00'
    repeat_type VARCHAR(50) DEFAULT 'daily', -- 'daily', 'weekly', 'custom'
    repeat_days INT[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Mon, 7=Sun
    voice_prompt_text TEXT,
    category VARCHAR(50) DEFAULT 'medicine', -- 'medicine', 'hydration', 'walk', 'meal', 'doctor'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DAILY ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'game', 'reminder_taken', 'reminder_deferred', 'voice_interaction', 'sos_drill'
    details JSONB DEFAULT '{}'::jsonb,
    completed BOOLEAN DEFAULT true,
    activity_date DATE DEFAULT CURRENT_DATE NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. EMERGENCY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    priority_order INT DEFAULT 1,
    notify_sms BOOLEAN DEFAULT true,
    notify_call BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PERSONAL MEMORY VAULT (Reminiscence & Familiar Content)
CREATE TABLE IF NOT EXISTS memory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    relationship VARCHAR(100), -- 'Son', 'Granddaughter', 'Home in Guwahati', 'Pet'
    image_url TEXT NOT NULL,
    voice_clip_url TEXT,
    story_text TEXT,
    language VARCHAR(50) DEFAULT 'hi',
    tags TEXT[] DEFAULT ARRAY['family'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SOS EVENTS TABLE
CREATE TABLE IF NOT EXISTS sos_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_name TEXT,
    status VARCHAR(50) DEFAULT 'triggered', -- 'triggered', 'acknowledged', 'resolved', 'test_drill'
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    caregiver_notified BOOLEAN DEFAULT true
);

-- 10. SYNC QUEUE LOG (For audit & debugging offline synchronization)
CREATE TABLE IF NOT EXISTS sync_queue_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    local_id VARCHAR(255) NOT NULL,
    operation VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    payload JSONB NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;

-- Allow caregivers access to their assigned patients only
CREATE POLICY "Caregivers can view assigned patients" ON users
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM caregivers WHERE caregivers.patient_id = users.id
        )
        OR auth.uid() IS NULL -- Permissive for public/demo API keys in local development
    );

CREATE POLICY "Caregivers can view patient game sessions" ON game_sessions
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM caregivers WHERE caregivers.patient_id = game_sessions.patient_id
        )
        OR auth.uid() IS NULL
    );

CREATE POLICY "Caregivers can view and manage memory items" ON memory_items
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM caregivers WHERE caregivers.patient_id = memory_items.patient_id
        )
        OR auth.uid() IS NULL
    );

-- ============================================================================
-- SEED DATA (Demo Setup for NER & Hindi Support)
-- ============================================================================

-- Insert Standard Game Catalog
INSERT INTO games (id, game_name, category, description, supported_languages)
VALUES
    ('pehchano_kaun', 'Pehchano Kaun? (Family Memory)', 'memory', 'Identify familiar family members and close relations from photos and audio clips', ARRAY['hi', 'en', 'as']),
    ('purane_din', 'Purane Din (Story Recall)', 'memory', 'Reminisce about pleasant past events, homes, and festivals with simple Yes/No recall', ARRAY['hi', 'en', 'as']),
    ('dawa_subah_routine', 'Dawa Aur Routine (Sequencing)', 'sequencing', 'Chronologically arrange familiar daily activities like tea, brushing, and medicines', ARRAY['hi', 'en', 'as']),
    ('ghar_ki_cheezein', 'Ghar Ki Cheezein (Object Matching)', 'matching', 'Match everyday household objects to their functional pairs (e.g. glasses to eyes)', ARRAY['hi', 'en', 'as']),
    ('ner_cultural_memory', 'NER Cultural Heritage', 'cultural', 'Connect with traditional North Eastern musical instruments, attires (Mekhela Chador), and crafts', ARRAY['hi', 'en', 'as']),
    ('gentle_motor_tap', 'Gentle Petals & Bubbles', 'motor', 'Low-stress calming motor exercise touching gentle floating petals or water bubbles', ARRAY['hi', 'en', 'as'])
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Demo Patient
INSERT INTO users (id, name, age, preferred_language, photo_url, notes)
VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Aai (Anjali Sharma)',
    76,
    'hi',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    'Resident of Guwahati. Loves morning bhajans and family photo albums.'
) ON CONFLICT (id) DO NOTHING;

-- Insert Caregiver
INSERT INTO caregivers (id, patient_id, name, phone, email, relationship)
VALUES (
    'b2c3d4e5-0000-0000-0000-000000000002',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Priyanka Sharma',
    '+919876543210',
    'priyanka.sharma@example.com',
    'Daughter'
) ON CONFLICT (id) DO NOTHING;

-- Insert Emergency Contacts
INSERT INTO emergency_contacts (patient_id, name, phone, relationship, priority_order)
VALUES 
    ('a1b2c3d4-0000-0000-0000-000000000001', 'Priyanka Sharma (Daughter)', '+919876543210', 'Daughter', 1),
    ('a1b2c3d4-0000-0000-0000-000000000001', 'Dr. Baruah (Clinic)', '+919811223344', 'Family Doctor', 2)
ON CONFLICT DO NOTHING;

-- Insert Demo Reminders
INSERT INTO reminders (patient_id, title, description, time_of_day, repeat_type, voice_prompt_text, category)
VALUES
    ('a1b2c3d4-0000-0000-0000-000000000001', 'Morning Blood Pressure Medicine', 'Take 1 tablet of Amlodipine with warm water after breakfast', '08:30:00', 'daily', 'Namaste Aai, subah ki dawa lene ka samay ho gaya hai.', 'medicine'),
    ('a1b2c3d4-0000-0000-0000-000000000001', 'Afternoon Hydration & Walk', 'Drink a glass of water and enjoy 10 minutes in the garden', '16:00:00', 'daily', 'Aai, thoda paani pee lijiye aur baageeche mein taazi hawa lijiye.', 'hydration'),
    ('a1b2c3d4-0000-0000-0000-000000000001', 'Night Calcium Medicine', 'Take 1 calcium tablet with warm milk', '20:30:00', 'daily', 'Aai, raat ka doodh aur calcium tablet lene ka samay ho gaya hai.', 'medicine')
ON CONFLICT DO NOTHING;

-- Insert Demo Memory Vault Items
INSERT INTO memory_items (patient_id, title, relationship, image_url, story_text, language, tags)
VALUES
    (
        'a1b2c3d4-0000-0000-0000-000000000001',
        'Priyanka',
        'Beti (Daughter)',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80',
        'Yeh aapki beti Priyanka hai. Woh Guwahati mein software engineer hai.',
        'hi',
        ARRAY['family', 'daughter']
    ),
    (
        'a1b2c3d4-0000-0000-0000-000000000001',
        'Aarav',
        'Pota (Grandson)',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
        'Yeh aapka pota Aarav hai. Usse aapke haath ke bane laddo bahut pasand hain.',
        'hi',
        ARRAY['family', 'grandson']
    ),
    (
        'a1b2c3d4-0000-0000-0000-000000000001',
        'Kaziranga Trip',
        'Family Vacation',
        'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=400&fit=crop&q=80',
        'Aap parivar ke saath Kaziranga ghoomne gaye the.',
        'hi',
        ARRAY['travel', 'assam']
    )
ON CONFLICT DO NOTHING;

