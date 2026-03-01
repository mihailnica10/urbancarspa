-- Fix: Create tenants table first before other tables that reference it
CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text,
	`logo_svg` text,
	`logo_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_slug_unique` ON `tenants` (`slug`);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text,
	`role` text NOT NULL,
	`tenant_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`last_login` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_sessions_token_unique` ON `admin_sessions` (`token`);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`tenant_id` text,
	`action` text NOT NULL,
	`details` text,
	`ip_address` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tenant_themes` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`background_color` text DEFAULT '0 0 0',
	`foreground_color` text DEFAULT '255 255 255',
	`primary_color` text DEFAULT '220 38 38',
	`secondary_color` text DEFAULT '39 39 42',
	`accent_color` text DEFAULT '220 38 38',
	`muted_color` text DEFAULT '39 39 42',
	`border_color` text DEFAULT '39 39 42',
	`card_color` text DEFAULT '24 24 24',
	`radius` text DEFAULT '0.625rem',
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tenant_social_links` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`display_name` text,
	`icon_svg` text,
	`is_enabled` integer DEFAULT true,
	`display_order` integer DEFAULT 0,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tenant_custom_buttons` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`icon_name` text,
	`icon_svg` text,
	`button_variant` text DEFAULT 'default',
	`button_size` text DEFAULT 'default',
	`is_enabled` integer DEFAULT true,
	`display_order` integer DEFAULT 0,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
