-- Fix security definer view by converting to a function
DROP VIEW IF EXISTS public.admin_analytics;

-- Create secure function for admin analytics instead of view
CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS TABLE (
  total_users bigint,
  total_messages bigint,
  active_usernames bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(DISTINCT p.user_id) as total_users,
    COUNT(m.id) as total_messages,
    COUNT(DISTINCT m.username) as active_usernames
  FROM public.profiles p
  LEFT JOIN public.messages m ON p.username = m.username;
$$;

-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (username, message_count)
  VALUES (NEW.username, 1)
  ON CONFLICT (username)
  DO UPDATE SET 
    message_count = user_stats.message_count + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$;