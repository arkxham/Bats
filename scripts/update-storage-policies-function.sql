-- Function to create storage policies
CREATE OR REPLACE FUNCTION create_storage_buckets()
RETURNS void AS $
BEGIN
  -- Create profile-picture bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-picture', 'profile-picture', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

  -- Create backgrounds bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('backgrounds', 'backgrounds', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

  -- Create songs bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('songs', 'songs', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create storage policies
CREATE OR REPLACE FUNCTION create_storage_policies()
RETURNS void AS $
BEGIN
  -- Delete existing policies to avoid conflicts
  DELETE FROM storage.policies WHERE bucket_id = 'profile-picture';
  DELETE FROM storage.policies WHERE bucket_id = 'backgrounds';
  DELETE FROM storage.policies WHERE bucket_id = 'songs';

  -- Create policy for profile-picture bucket - allow authenticated users to upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'profile-picture',
    'Avatar Insert Policy',
    jsonb_build_object(
      'name', 'Avatar Insert Policy',
      'statement', 'INSERT',
      'resource', 'profile-picture/*',
      'action', 'insert',
      'role', 'authenticated'
    )
  );

  -- Create policy for profile-picture bucket - allow authenticated users to update
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'profile-picture',
    'Avatar Update Policy',
    jsonb_build_object(
      'name', 'Avatar Update Policy',
      'statement', 'UPDATE',
      'resource', 'profile-picture/*',
      'action', 'update',
      'role', 'authenticated'
    )
  );

  -- Create policy for profile-picture bucket - allow authenticated users to delete
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'profile-picture',
    'Avatar Delete Policy',
    jsonb_build_object(
      'name', 'Avatar Delete Policy',
      'statement', 'DELETE',
      'resource', 'profile-picture/*',
      'action', 'delete',
      'role', 'authenticated'
    )
  );

  -- Create policy for profile-picture bucket - allow public read
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'profile-picture',
    'Avatar Public Read',
    jsonb_build_object(
      'name', 'Avatar Public Read',
      'statement', 'SELECT',
      'resource', 'profile-picture/*',
      'action', 'select',
      'role', 'anon'
    )
  );

  -- Create policy for backgrounds bucket - allow authenticated users to upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'backgrounds',
    'Background Insert Policy',
    jsonb_build_object(
      'name', 'Background Insert Policy',
      'statement', 'INSERT',
      'resource', 'backgrounds/*',
      'action', 'insert',
      'role', 'authenticated'
    )
  );

  -- Create policy for backgrounds bucket - allow authenticated users to update
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'backgrounds',
    'Background Update Policy',
    jsonb_build_object(
      'name', 'Background Update Policy',
      'statement', 'UPDATE',
      'resource', 'backgrounds/*',
      'action', 'update',
      'role', 'authenticated'
    )
  );

  -- Create policy for backgrounds bucket - allow authenticated users to delete
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'backgrounds',
    'Background Delete Policy',
    jsonb_build_object(
      'name', 'Background Delete Policy',
      'statement', 'DELETE',
      'resource', 'backgrounds/*',
      'action', 'delete',
      'role', 'authenticated'
    )
  );

  -- Create policy for backgrounds bucket - allow public read
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'backgrounds',
    'Background Public Read',
    jsonb_build_object(
      'name', 'Background Public Read',
      'statement', 'SELECT',
      'resource', 'backgrounds/*',
      'action', 'select',
      'role', 'anon'
    )
  );

  -- Create policy for songs bucket - allow authenticated users to upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'songs',
    'Songs Insert Policy',
    jsonb_build_object(
      'name', 'Songs Insert Policy',
      'statement', 'INSERT',
      'resource', 'songs/*',
      'action', 'insert',
      'role', 'authenticated'
    )
  );

  -- Create policy for songs bucket - allow authenticated users to update
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'songs',
    'Songs Update Policy',
    jsonb_build_object(
      'name', 'Songs Update Policy',
      'statement', 'UPDATE',
      'resource', 'songs/*',
      'action', 'update',
      'role', 'authenticated'
    )
  );

  -- Create policy for songs bucket - allow authenticated users to delete
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'songs',
    'Songs Delete Policy',
    jsonb_build_object(
      'name', 'Songs Delete Policy',
      'statement', 'DELETE',
      'resource', 'songs/*',
      'action', 'delete',
      'role', 'authenticated'
    )
  );

  -- Create policy for songs bucket - allow public read
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'songs',
    'Songs Public Read',
    jsonb_build_object(
      'name', 'Songs Public Read',
      'statement', 'SELECT',
      'resource', 'songs/*',
      'action', 'select',
      'role', 'anon'
    )
  );

  -- Disable RLS for these buckets to ensure admin access
  UPDATE storage.buckets SET public = true WHERE id = 'profile-picture';
  UPDATE storage.buckets SET public = true WHERE id = 'backgrounds';
  UPDATE storage.buckets SET public = true WHERE id = 'songs';
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
