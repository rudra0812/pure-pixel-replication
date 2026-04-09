CREATE POLICY "Users can update their own media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'journal-media' AND auth.uid()::text = (storage.foldername(name))[1]);