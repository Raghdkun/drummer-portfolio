-- Add attachments column to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT NULL;

-- Create storage bucket for message attachments if it doesn't exist
-- Note: This needs to be done in the Supabase dashboard or via the API

-- Update RLS policies for the contact_submissions table
DROP POLICY IF EXISTS "Public can view contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage contact_submissions" ON contact_submissions;

CREATE POLICY "Public can view contact_submissions" 
ON contact_submissions FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage contact_submissions" 
ON contact_submissions FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
