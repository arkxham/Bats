-- Create descriptions bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('descriptions', 'descriptions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Delete existing policies to avoid conflicts
DELETE FROM storage.policies WHERE bucket_id = 'descriptions';

-- Create policies for descriptions bucket
-- Allow anonymous users to select (read) files
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'descriptions',
  'Descriptions Public Read',
  jsonb_build_object(
    'name', 'Descriptions Public Read',
    'statement', 'SELECT',
    'resource', 'descriptions/*',
    'action', 'select',
    'role', 'anon'
  )
);

-- Allow authenticated users to insert files
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'descriptions',
  'Descriptions Insert Policy',
  jsonb_build_object(
    'name', 'Descriptions Insert Policy',
    'statement', 'INSERT',
    'resource', 'descriptions/*',
    'action', 'insert',
    'role', 'authenticated'
  )
);

-- Allow authenticated users to update files
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'descriptions',
  'Descriptions Update Policy',
  jsonb_build_object(
    'name', 'Descriptions Update Policy',
    'statement', 'UPDATE',
    'resource', 'descriptions/*',
    'action', 'update',
    'role', 'authenticated'
  )
);

-- Allow authenticated users to delete files
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'descriptions',
  'Descriptions Delete Policy',
  jsonb_build_object(
    'name', 'Descriptions Delete Policy',
    'statement', 'DELETE',
    'resource', 'descriptions/*',
    'action', 'delete',
    'role', 'authenticated'
  )
);

-- Create a function to check if a user owns a file path
CREATE OR REPLACE FUNCTION storage.is_owner_of_folder(bucket_id text, name text, userid uuid)
RETURNS boolean AS $$
BEGIN
  -- Extract the folder name from the path
  -- Assuming the path format is "{user_id}/filename"
  RETURN (split_part(name, '/', 1) = userid::text);
END;
$$ LANGUAGE plpgsql;

-- Add a policy that allows users to manage only their own files
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'descriptions',
  'Descriptions Owner Policy',
  jsonb_build_object(
    'name', 'Descriptions Owner Policy',
    'statement', 'ALL',
    'resource', 'descriptions/*',
    'action', 'ALL',
    'role', 'authenticated',
    'check', '(storage.is_owner_of_folder(bucket_id, name, auth.uid()))'
  )
);
