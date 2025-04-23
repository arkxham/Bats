-- Function to create storage buckets if they don't exist
CREATE OR REPLACE FUNCTION create_storage_buckets()
RETURNS void AS $$
BEGIN
  -- Create profile-picture bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-picture', 'profile-picture', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

  -- Create backgrounds bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('backgrounds', 'backgrounds', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create storage policies
CREATE OR REPLACE FUNCTION create_storage_policies()
RETURNS void AS $$
BEGIN
  -- Delete existing policies to avoid conflicts
  DELETE FROM storage.policies WHERE bucket_id = 'profile-picture';
  DELETE FROM storage.policies WHERE bucket_id = 'backgrounds';

  -- Create policy for profile-picture bucket - allow authenticated users to upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'profile-picture',
    'Avatar Policy',
    jsonb_build_object(
      'name', 'Avatar Policy',
      'statement', 'INSERT',
      'resource', 'profile-picture/*',
      'action', 'insert',
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
    'Background Policy',
    jsonb_build_object(
      'name', 'Background Policy',
      'statement', 'INSERT',
      'resource', 'backgrounds/*',
      'action', 'insert',
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

  -- Disable RLS for these buckets to ensure admin access
  UPDATE storage.buckets SET public = true WHERE id = 'profile-picture';
  UPDATE storage.buckets SET public = true WHERE id = 'backgrounds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
