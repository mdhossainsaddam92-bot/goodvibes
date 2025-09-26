-- Create messages table for storing appreciation messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance when fetching messages by username
CREATE INDEX idx_messages_username ON public.messages(username);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages (public submission)
CREATE POLICY "Anyone can submit messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view messages (public reading)
CREATE POLICY "Anyone can view messages" 
ON public.messages 
FOR SELECT 
USING (true);

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;