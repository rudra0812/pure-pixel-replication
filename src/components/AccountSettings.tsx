import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera, User } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { AnimatedGradient } from "./AnimatedGradient";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AccountSettingsProps {
  onBack: () => void;
}

export const AccountSettings = ({ onBack }: AccountSettingsProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name, bio, avatar_url")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.display_name || "");
            setBio(data.bio || "");
            setAvatarUrl(data.avatar_url);
          }
        });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("journal-media")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("journal-media")
        .getPublicUrl(path);

      setAvatarUrl(urlData.publicUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("user_id", user.id);

      toast.success("Avatar updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile saved!");
      onBack();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatedGradient variant="calm" className="min-h-screen">
      <motion.div
        className="flex min-h-screen flex-col safe-area-top pb-28"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <header className="flex items-center gap-3 px-6 pt-8 pb-6">
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted/50"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        </header>

        <div className="px-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary overflow-hidden"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-primary-foreground" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Tap to change photo"}
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="rounded-2xl bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              value={user?.email || ""}
              readOnly
              className="rounded-2xl bg-card/50 backdrop-blur-sm border-border/50 opacity-60"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[100px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/50 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 rounded-2xl"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </AnimatedGradient>
  );
};
