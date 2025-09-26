-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role public.app_role NOT NULL DEFAULT 'user';

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create function to check if user is admin
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

-- Create analytics view for admin dashboard
CREATE OR REPLACE VIEW public.admin_analytics AS
SELECT 
  COUNT(DISTINCT p.user_id) as total_users,
  COUNT(m.id) as total_messages,
  COUNT(DISTINCT m.username) as active_usernames
FROM public.profiles p
LEFT JOIN public.messages m ON p.username = m.username;

-- Create RLS policy for admin analytics
CREATE POLICY "Only admins can view analytics" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Update existing profiles policies to allow admins to see all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Update messages policy to allow admins to see all messages
CREATE POLICY "Admins can view all messages" 
ON public.messages 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Create user statistics table for tracking popular users
CREATE TABLE public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  message_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(username)
);

-- Enable RLS on user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Policy for user_stats - only admins can view
CREATE POLICY "Only admins can view user stats" 
ON public.user_stats 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Function to update user stats when messages are inserted
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (username, message_count)
  VALUES (NEW.username, 1)
  ON CONFLICT (username)
  DO UPDATE SET 
    message_count = user_stats.message_count + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats on message insert
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();

-- Trigger for updating updated_at on user_stats
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();