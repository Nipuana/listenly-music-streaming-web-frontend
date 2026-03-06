"use client";

import React, { useEffect, useState } from "react";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/Providers/Contexts/auth-context";
import useUserAdditionalInfo from "@/hooks/user-hooks/use-user-additional-info";
import useUserProfile from "@/hooks/user-hooks/use-user-profile";
import { toast } from "react-toastify";

interface EditProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialUser?: any;
}

export default function EditProfilePopup({ isOpen, onClose, initialUser }: EditProfilePopupProps) {
  const { user } = useAuth();
  const baseStartUser = initialUser || user;

  const normalizeAdditional = (raw: any) => ({
    phoneNumber: raw?.phoneNumber ?? "",
    address: raw?.address ?? "",
    city: raw?.city ?? "",
    country: raw?.country ?? "",
    postalCode: raw?.postalCode ?? "",
    gender: raw?.gender ?? "",
    dateOfBirth: raw?.dateOfBirth ?? "",
    age: raw?.age ?? "",
    bio: raw?.bio ?? "",
  });

  const [form, setForm] = useState<any>({
    email: baseStartUser?.email ?? "",
    username: baseStartUser?.username ?? baseStartUser?.userName ?? "",
    additionalInfo: normalizeAdditional(baseStartUser?.additionalInfo),
  });

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showAdditional, setShowAdditional] = useState(false);

  const { additionalInfo, refresh, saveAdditionalInfo } = useUserAdditionalInfo();
  const { updateProfile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    let mounted = true;
    if (!isOpen) return;
    setShowAdditional(false);
    setForm({
      email: baseStartUser?.email ?? "",
      username: baseStartUser?.username ?? baseStartUser?.userName ?? "",
      additionalInfo: normalizeAdditional(baseStartUser?.additionalInfo),
    });
    setError(null);

    // try to refresh additionalInfo from API/cache when popup opens
    (async () => {
      try {
        const ai = await refresh();
        if (!mounted) return;
        if (ai) {
          setForm((prev: any) => ({ ...prev, additionalInfo: { ...prev.additionalInfo, ...normalizeAdditional(ai) } }));
        }
      } catch (e) {
        // ignore; saveAdditionalInfo will surface errors
      }
    })();

    return () => {
      mounted = false;
    };
    // intentionally not including `refresh` to avoid effect re-running when hook recreates functions
  }, [isOpen, initialUser, user]);

  // keep form in sync when additionalInfo updates elsewhere
  useEffect(() => {
    if (!isOpen) return;
    if (additionalInfo) {
      setForm((prev: any) => ({ ...prev, additionalInfo: { ...prev.additionalInfo, ...normalizeAdditional(additionalInfo) } }));
    }
  }, [additionalInfo, isOpen]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const updateAdditionalInfo = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: value
      }
    }));
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSaveProfile = async () => {
    setError(null);
    setLoading(true);
    try {
      let payload: any = { username: form.username, email: form.email };
      if (file) {
        const fd = new FormData();
        fd.append('username', form.username || '');
        fd.append('email', form.email || '');
        fd.append('profilePicture', file);
        payload = fd;
      }

      const result = await updateProfile(payload);
      if (result?.success) {
        toast.success('Profile updated');
        onClose();
      } else {
        toast.error(result?.message || 'Failed to update profile');
        setError(result?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setError(null);
    setDetailsLoading(true);
    try {
      const payload = { ...(form.additionalInfo || {}) };
      await saveAdditionalInfo(payload);
      toast.success('Additional info updated');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save additional info');
      setError(err?.message || String(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatedPopup isOpen={isOpen} onClose={handleClose} className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <p className="text-sm text-muted-foreground mb-4">Edit your profile information</p>
        <div className="space-y-4">
          {/* Main profile section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-center gap-4">
              <div>
                <Label>Profile Picture</Label>
                <label title="Click to change profile picture" className="flex items-center gap-4 cursor-pointer">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center hover:opacity-90">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-sm text-muted-foreground">No image</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    aria-label="Choose profile picture"
                  />
                  <div className="text-sm text-foreground underline">Change</div>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter username" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
            </div>
          </div>

          <div>
            <Button type="button" variant="ghost" onClick={() => setShowAdditional((s) => !s)}>
              {showAdditional ? "Hide additional info" : "Show additional info"}
            </Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between gap-2 mt-4">
            <div>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleSaveProfile} disabled={loading || profileLoading}>{(loading || profileLoading) ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </div>

          {/* Additional info section (hidden by default) */}
          {showAdditional && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Additional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={form.additionalInfo.phoneNumber} onChange={(e) => updateAdditionalInfo('phoneNumber', e.target.value)} placeholder="Phone number" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={form.additionalInfo.gender} onValueChange={(v) => updateAdditionalInfo('gender', v)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" value={form.additionalInfo.dateOfBirth} onChange={(e) => updateAdditionalInfo('dateOfBirth', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={form.additionalInfo.age} onChange={(e) => updateAdditionalInfo('age', e.target.value)} placeholder="Age" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.additionalInfo.address} onChange={(e) => updateAdditionalInfo('address', e.target.value)} placeholder="Address" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.additionalInfo.city} onChange={(e) => updateAdditionalInfo('city', e.target.value)} placeholder="City" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.additionalInfo.country} onChange={(e) => updateAdditionalInfo('country', e.target.value)} placeholder="Country" />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" value={form.additionalInfo.postalCode} onChange={(e) => updateAdditionalInfo('postalCode', e.target.value)} placeholder="Postal Code" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={form.additionalInfo.bio} onChange={(e) => updateAdditionalInfo('bio', e.target.value)} placeholder="Brief description about you" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAdditional(false)}>Hide</Button>
                <Button type="button" variant="secondary" onClick={handleSaveDetails} disabled={detailsLoading}>{detailsLoading ? 'Saving...' : 'Save Details'}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPopup>
  );
}
