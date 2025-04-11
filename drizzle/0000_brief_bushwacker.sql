CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_1_id" integer NOT NULL,
	"team_2_id" integer NOT NULL,
	"score_team_1" integer DEFAULT 0,
	"score_team_2" integer DEFAULT 0,
	"match_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"goals_scored" integer DEFAULT 0,
	"assists" integer DEFAULT 0,
	"yellow_cards" integer DEFAULT 0,
	"red_cards" integer DEFAULT 0,
	CONSTRAINT "statistics_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"captain_id" integer,
	"players" json DEFAULT '[]'::json,
	"points" integer DEFAULT 0,
	"matches_played" integer DEFAULT 0,
	CONSTRAINT "teams_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'player' NOT NULL,
	"team_id" integer,
	"statistics_id" integer,
	"date_registered" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
