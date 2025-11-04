-- Migration: Make session_id nullable if present to avoid insert failures
-- This script checks for the existence of the session_id column and will alter
-- it to allow NULL values if it exists. Run this against the careerconnect2 database.

USE careerconnect2;

SET @cnt := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'career_chats'
    AND COLUMN_NAME = 'session_id'
);

-- If the column exists, modify it to allow NULL
SET @sql := IF(@cnt > 0,
  'ALTER TABLE career_chats MODIFY COLUMN session_id VARCHAR(255) NULL;',
  'SELECT "no_change";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on user_id if missing (safe to run)
SET @idx := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'career_chats'
    AND INDEX_NAME = 'idx_career_chats_user'
);

SET @idxsql := IF(@idx = 0,
  'CREATE INDEX idx_career_chats_user ON career_chats (user_id);',
  'SELECT "idx_exists";'
);

PREPARE idxstmt FROM @idxsql;
EXECUTE idxstmt;
DEALLOCATE PREPARE idxstmt;
