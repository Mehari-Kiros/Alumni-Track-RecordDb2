/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const POSTGRESQL_DDL_SCHEMA = `-- =====================================================================
-- ETHIOPIAN DEFENCE UNIVERSITY ALUMNI TRACK RECORD DATABASE (EDU-ATRD)
-- Comprehensive PostgreSQL Relational Schema (3NF Architecture)
-- Supports historical records from 1999 to Present and Future Batches
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COLLEGES TABLE
CREATE TABLE colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    established_year INT NOT NULL CHECK (established_year >= 1999),
    dean_name VARCHAR(150),
    campus_location VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    college_id INT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(15) NOT NULL UNIQUE,
    head_of_department VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ACADEMIC PROGRAMS TABLE
CREATE TABLE academic_programs (
    id SERIAL PRIMARY KEY,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    program_name VARCHAR(200) NOT NULL,
    degree_awarded VARCHAR(100) NOT NULL,
    duration_years NUMERIC(3, 1) DEFAULT 4.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. QUALIFICATIONS TABLE
CREATE TABLE qualifications (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE, -- 'Diploma', 'Bachelor''s Degree', 'Master''s Degree', 'PhD'
    hierarchy_order INT NOT NULL,
    description TEXT
);

-- 5. GRADUATION BATCHES TABLE
CREATE TABLE graduation_batches (
    id SERIAL PRIMARY KEY,
    graduation_year INT NOT NULL UNIQUE CHECK (graduation_year >= 1999),
    commencement_date DATE,
    theme_motto VARCHAR(255),
    is_historical_diploma_first_batch BOOLEAN DEFAULT FALSE
);

-- 6. EMPLOYERS & ORGANIZATIONS TABLE
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    sector VARCHAR(100) NOT NULL, -- 'Military & Defence', 'State Enterprise', 'Public Service', etc.
    country VARCHAR(100) DEFAULT 'Ethiopia',
    city VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ALUMNI MASTER TABLE
CREATE TABLE alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumni_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. EDU/ENG/1999/001
    full_name VARCHAR(200) NOT NULL,
    gender VARCHAR(15) CHECK (gender IN ('Male', 'Female', 'Unknown')),
    date_of_birth DATE,
    college_id INT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    program_id INT REFERENCES academic_programs(id),
    qualification_id INT NOT NULL REFERENCES qualifications(id),
    graduation_year INT NOT NULL REFERENCES graduation_batches(graduation_year),
    
    phone VARCHAR(50),
    email VARCHAR(150),
    country VARCHAR(100) DEFAULT 'Ethiopia',
    region VARCHAR(100),
    current_rank_or_title VARCHAR(100),
    
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by_user_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EMPLOYMENT STATUS & CAREER TRACK RECORDS
CREATE TABLE employment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumnus_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
    employment_status VARCHAR(50) NOT NULL CHECK (employment_status IN ('Employed', 'Self-Employed', 'Unemployed', 'Unknown')),
    employer_id INT REFERENCES employers(id),
    employer_name_freeform VARCHAR(200),
    position_title VARCHAR(150),
    sector VARCHAR(100) NOT NULL,
    start_year INT CHECK (start_year >= 1999),
    end_year INT,
    is_current BOOLEAN DEFAULT TRUE,
    job_relevance_to_degree BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FURTHER EDUCATION & POSTGRADUATE PROGRESSION
CREATE TABLE further_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumnus_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
    degree_title VARCHAR(150) NOT NULL,
    institution_name VARCHAR(200) NOT NULL,
    country VARCHAR(100) DEFAULT 'Ethiopia',
    completion_year INT,
    field_of_study VARCHAR(150)
);

-- 10. PROFESSIONAL CERTIFICATIONS
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumnus_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
    certificate_name VARCHAR(200) NOT NULL,
    issuing_body VARCHAR(200),
    year_awarded INT
);

-- 11. USER ROLES & ACCESS CONTROL (RBAC)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    role_key VARCHAR(50) NOT NULL UNIQUE, -- 'system_admin', 'data_admin', 'management', 'public'
    role_name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL
);

-- 12. USER ACCOUNTS TABLE
CREATE TABLE user_accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id INT NOT NULL REFERENCES user_roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. UPLOADED DATASETS & FILE METADATA
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_format VARCHAR(20) NOT NULL, -- 'xlsx', 'xls', 'csv'
    file_size_bytes BIGINT NOT NULL,
    uploaded_by_user_id INT REFERENCES user_accounts(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. IMPORT HISTORY & BATCH RECONCILIATION
CREATE TABLE import_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES uploaded_files(id),
    administrator_name VARCHAR(150) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    total_records INT NOT NULL,
    valid_records INT NOT NULL,
    duplicate_records INT NOT NULL,
    corrected_records INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. AUDIT LOGS (Immutable Security Trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES user_accounts(id),
    username VARCHAR(100) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- 'BULK_IMPORT', 'CREATE_RECORD', 'UPDATE_RECORD', 'DELETE_RECORD', 'EXPORT_DATA'
    entity_affected VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR ULTRA-FAST REPORTING & SEARCHES
CREATE INDEX idx_alumni_college ON alumni(college_id);
CREATE INDEX idx_alumni_year ON alumni(graduation_year);
CREATE INDEX idx_alumni_qualification ON alumni(qualification_id);
CREATE INDEX idx_alumni_department ON alumni(department_id);
CREATE INDEX idx_alumni_full_name_trgm ON alumni(full_name);
CREATE INDEX idx_employment_status ON employment_records(employment_status);
CREATE INDEX idx_employment_sector ON employment_records(sector);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
`;

export const POSTGRESQL_MIGRATIONS = `-- =====================================================================
-- DATABASE MIGRATION SCRIPTS
-- Migration 001: Initial Core Schema and Enums
-- =====================================================================

-- Step 1: Initialize Colleges with 1999 Inception Date
INSERT INTO colleges (name, code, established_year, dean_name, campus_location, description)
VALUES 
('College of Engineering', 'COE', 1999, 'Col. Dr. Eng. Yohannes Tadesse', 'Bishoftu Main Campus', 'Premier centre for defence engineering, armament technology, aeronautics and cyber defence.'),
('College of Health Sciences', 'COHS', 2003, 'Col. Dr. Senait Mengistu', 'Tor Hayloch Armed Forces Medical Complex, Addis Ababa', 'Centre of excellence in military trauma surgery, field medicine, and healthcare.'),
('College of Business and Social Studies', 'COBSS', 1999, 'Col. Gebremedhin Tekle', 'Bishoftu & Addis Ababa Campuses', 'Strategic defence management, military logistics, and defence procurement.');

-- Step 2: Initialize Qualifications Hierarchy
INSERT INTO qualifications (level_name, hierarchy_order, description)
VALUES 
('Diploma', 1, 'Two to three year foundational qualification (started 1999 first batch, 2000 second batch, 2001 third batch)'),
('Bachelor''s Degree', 2, 'Undergraduate 4-5 year programs (started 2002 first degree batch, 2003 second batch, BSc, BA, MD)'),
('Master''s Degree', 3, 'Postgraduate advanced degrees (MSc, MA)'),
('PhD', 4, 'Terminal doctorate and doctoral research');

-- Step 3: Populate Historical Batches (1999 to 2026)
DO $$
DECLARE
    yr INT;
BEGIN
    FOR yr IN 1999..2026 LOOP
        INSERT INTO graduation_batches (graduation_year, is_historical_diploma_first_batch)
        VALUES (yr, (yr = 1999))
        ON CONFLICT (graduation_year) DO NOTHING;
    END LOOP;
END $$;

-- Step 4: Setup RBAC Roles
INSERT INTO user_roles (role_key, role_name, permissions)
VALUES 
('system_admin', 'System Administrator', '{"all": true, "manage_users": true, "bulk_upload": true, "delete": true, "view_audit": true}'),
('data_admin', 'Data Administrator', '{"bulk_upload": true, "edit_records": true, "export": true, "view_reports": true}'),
('management', 'Management / Decision Makers', '{"view_dashboards": true, "view_reports": true, "tracer_indicators": true, "export_summaries": true}'),
('public', 'Public Website Visitor', '{"view_aggregate_stats": true, "view_public_reports": true, "mask_personal_info": true}');
`;
