-- This script fixes storage bucket permissions and policies
-- Run this if you're experiencing RLS policy issues

-- Make buckets public
UPDATE storage.buckets SET public = true WHERE id = 'profile-picture';
UPDATE storage.buckets SET public = true WHERE id = 'backgrounds';

-- Delete existing policies to avoid conflicts
DELETE FROM storage.policies WHERE bucket_id = 'profile-picture';
DELETE FROM storage.policies WHERE bucket_id = 'backgrounds';

-- Create policy for profile-picture bucket - allow authenticated users to upload
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'profile-picture',
  'Avatar Policy',
  '{"statement": "INSERT", "resource": "profile-picture/*", "action": "insert", "role": "authenticated"}'::jsonb
);

-- Create policy for profile-picture bucket - allow authenticated users to delete
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'profile-picture',
  'Avatar Delete Policy',
  '{"statement": "DELETE", "resource": "profile-picture/*", "action": "delete", "role": "authenticated"}'::jsonb
);

-- Create policy for profile-picture bucket - allow public read
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'profile-picture',
  'Avatar Public Read',
  '{"statement": "SELECT", "resource": "profile-picture/*", "action": "select", "role": "anon"}'::jsonb
);

-- Create policy for backgrounds bucket - allow authenticated users to upload
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'backgrounds',
  'Background Policy',
  '{"statement": "INSERT", "resource": "backgrounds/*", "action": "insert", "role": "authenticated"}'::jsonb
);

-- Create policy for backgrounds bucket - allow authenticated users to delete
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'backgrounds',
  'Background Delete Policy',
  '{"statement": "DELETE", "resource": "backgrounds/*", "action": "delete", "role": "authenticated"}'::jsonb
);

-- Create policy for backgrounds bucket - allow public read
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'backgrounds',
  'Background Public Read',
  '{"statement": "SELECT", "resource": "backgrounds/*", "action": "select", "role": "anon"}'::jsonb
);
