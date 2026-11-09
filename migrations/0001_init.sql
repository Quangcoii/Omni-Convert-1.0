-- Aggregate, privacy-first usage counters. No IPs, filenames, file contents or user ids are stored.
CREATE TABLE IF NOT EXISTS daily_events (
  day      TEXT    NOT NULL,           -- YYYY-MM-DD (UTC)
  category TEXT    NOT NULL,
  tool     TEXT    NOT NULL,
  event    TEXT    NOT NULL,           -- tool_view | tool_success | tool_error
  count    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, category, tool, event)
);
CREATE INDEX IF NOT EXISTS idx_daily_events_day ON daily_events(day);
