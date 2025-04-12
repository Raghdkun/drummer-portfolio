-- Update RLS policies to allow authenticated users to perform all operations

-- For site_config table
DROP POLICY IF EXISTS "Public can view site_config" ON site_config;
DROP POLICY IF EXISTS "Authenticated users can manage site_config" ON site_config;

CREATE POLICY "Public can view site_config" 
ON site_config FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage site_config" 
ON site_config FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For profile table
DROP POLICY IF EXISTS "Public can view profile" ON profile;
DROP POLICY IF EXISTS "Authenticated users can manage profile" ON profile;

CREATE POLICY "Public can view profile" 
ON profile FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage profile" 
ON profile FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For specialties table
DROP POLICY IF EXISTS "Public can view specialties" ON specialties;
DROP POLICY IF EXISTS "Authenticated users can manage specialties" ON specialties;

CREATE POLICY "Public can view specialties" 
ON specialties FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage specialties" 
ON specialties FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For instruments table
DROP POLICY IF EXISTS "Public can view instruments" ON instruments;
DROP POLICY IF EXISTS "Authenticated users can manage instruments" ON instruments;

CREATE POLICY "Public can view instruments" 
ON instruments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage instruments" 
ON instruments FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For stats table
DROP POLICY IF EXISTS "Public can view stats" ON stats;
DROP POLICY IF EXISTS "Authenticated users can manage stats" ON stats;

CREATE POLICY "Public can view stats" 
ON stats FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage stats" 
ON stats FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For media table
DROP POLICY IF EXISTS "Public can view media" ON media;
DROP POLICY IF EXISTS "Authenticated users can manage media" ON media;

CREATE POLICY "Public can view media" 
ON media FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage media" 
ON media FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- For events table
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;

CREATE POLICY "Public can view events" 
ON events FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage events" 
ON events FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
