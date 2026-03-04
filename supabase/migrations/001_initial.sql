-- Brew methods (seeded, admin-managed)
CREATE TABLE brew_methods (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text UNIQUE NOT NULL,
  name       text NOT NULL,
  is_active  boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  steps      jsonb NOT NULL DEFAULT '[]'
);

-- Recipes (barista defaults + user custom)
CREATE TABLE recipes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users ON DELETE CASCADE,
  method_id   uuid REFERENCES brew_methods NOT NULL,
  name        text NOT NULL,
  author      text,
  is_default  boolean DEFAULT false,
  is_public   boolean DEFAULT false,
  slug        text UNIQUE,
  params      jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Brew history
CREATE TABLE brews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users ON DELETE CASCADE,
  recipe_id    uuid REFERENCES recipes,
  method_slug  text NOT NULL,
  started_at   timestamptz NOT NULL,
  completed_at timestamptz,
  notes        text,
  created_at   timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE brews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own brews" ON brews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own and public recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_default = true);

CREATE POLICY "Users manage own recipes" ON recipes
  FOR ALL USING (auth.uid() = user_id);

-- brew_methods is public read
ALTER TABLE brew_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brew_methods" ON brew_methods
  FOR SELECT USING (true);
