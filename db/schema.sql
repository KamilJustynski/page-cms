CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE pages (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text         NOT NULL UNIQUE,
  title       text         NOT NULL,
  status      page_status  NOT NULL DEFAULT 'draft',
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now()
);