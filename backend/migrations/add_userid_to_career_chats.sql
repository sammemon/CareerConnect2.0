-- Migration: Add user_id, response and created_at columns to career_chats
-- Run this against the careerconnect2 database if the existing career_chats table
-- doesn't already include user_id/response/created_at. This migration is safe to run
-- twice (uses IF NOT EXISTS checks).

ALTER TABLE career_chats
  ADD COLUMN IF NOT EXISTS user_id INT NULL,
  ADD COLUMN IF NOT EXISTS response TEXT NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NULL;

-- If created_at is NULL for older rows, set it from timestamp or NOW()
UPDATE career_chats SET created_at = COALESCE(created_at, NOW()) WHERE created_at IS NULL;

-- Add foreign key constraint if it doesn't exist
-- Note: MySQL does not support IF NOT EXISTS for foreign keys; run this only if you
-- do not already have the constraint and ensure no FK name collision.
-- ALTER TABLE career_chats
--   ADD CONSTRAINT fk_careerchats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for quick user lookups
CREATE INDEX IF NOT EXISTS idx_career_chats_user ON career_chats (user_id);
