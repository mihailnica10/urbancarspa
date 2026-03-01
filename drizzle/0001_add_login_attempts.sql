-- Migration to add login_attempts table for rate limiting
CREATE TABLE `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`ip_address` text NOT NULL,
	`success` integer NOT NULL,
	`attempts_count` integer DEFAULT 1 NOT NULL,
	`lockout_until` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
