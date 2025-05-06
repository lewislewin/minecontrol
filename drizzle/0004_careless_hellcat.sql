DROP INDEX `servers_token_unique`;--> statement-breakpoint
ALTER TABLE `servers` ADD `name` text;--> statement-breakpoint
ALTER TABLE `servers` DROP COLUMN `token`;--> statement-breakpoint
ALTER TABLE `aws_credentials` ADD `name` text;