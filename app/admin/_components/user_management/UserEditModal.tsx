import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UserEditModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
}

export default function UserEditModal({ user, open, onClose, onSave }: UserEditModalProps) {
  const [form, setForm] = React.useState({
    name: user?.name || user?.username || user?.userName || '',
    email: user?.email || '',
    role: user?.role || 'user',
    additionalInfo: {
      phoneNumber: user?.additionalInfo?.phoneNumber || '',
      address: user?.additionalInfo?.address || '',
      city: user?.additionalInfo?.city || '',
      country: user?.additionalInfo?.country || '',
      postalCode: user?.additionalInfo?.postalCode || '',
      gender: user?.additionalInfo?.gender || '',
      dateOfBirth: user?.additionalInfo?.dateOfBirth ? new Date(user.additionalInfo.dateOfBirth).toISOString().split('T')[0] : '',
      age: user?.additionalInfo?.age || '',
      bio: user?.additionalInfo?.bio || '',
    }
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name || user.username || user.userName || '',
        email: user.email || '',
        role: user.role || 'user',
        additionalInfo: {
          phoneNumber: user?.additionalInfo?.phoneNumber || '',
          address: user?.additionalInfo?.address || '',
          city: user?.additionalInfo?.city || '',
          country: user?.additionalInfo?.country || '',
          postalCode: user?.additionalInfo?.postalCode || '',
          gender: user?.additionalInfo?.gender || '',
          dateOfBirth: user?.additionalInfo?.dateOfBirth ? new Date(user.additionalInfo.dateOfBirth).toISOString().split('T')[0] : '',
          age: user?.additionalInfo?.age || '',
          bio: user?.additionalInfo?.bio || '',
        }
      });
    }
  }, [user, open]);

  if (!open) return null;

  const updateAdditionalInfo = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-background rounded-3xl shadow-2xl max-w-4xl w-full mx-4 border border-border flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header with close button */}
        <div className="flex items-center justify-between px-10 pt-8 pb-2 border-b border-border sticky top-0 bg-white dark:bg-background z-10">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Edit User</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
            <X size={24} />
          </button>
        </div>
        {/* Scrollable form content */}
        <form className="flex-1 overflow-y-auto px-10 py-6" style={{ maxHeight: '70vh' }}>
          <p className="text-muted-foreground mb-8">Update user details and additional information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <Label htmlFor="name" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Enter name"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="email" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="user@example.com"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="role" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Role</Label>
              <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                <SelectTrigger id="role" className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm w-full focus:ring-2 focus:ring-primary/30">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-55 bg-white dark:bg-background">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={form.additionalInfo.phoneNumber}
                onChange={e => updateAdditionalInfo('phoneNumber', e.target.value)}
                placeholder="Phone number"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="gender" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Gender</Label>
              <Select value={form.additionalInfo.gender} onValueChange={(value) => updateAdditionalInfo('gender', value)}>
                <SelectTrigger id="gender" className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm w-full focus:ring-2 focus:ring-primary/30">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-55 bg-white dark:bg-background">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateOfBirth" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.additionalInfo.dateOfBirth}
                onChange={e => updateAdditionalInfo('dateOfBirth', e.target.value)}
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="age" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={form.additionalInfo.age}
                onChange={e => updateAdditionalInfo('age', e.target.value)}
                placeholder="Age"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.additionalInfo.address}
                onChange={e => updateAdditionalInfo('address', e.target.value)}
                placeholder="Address"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="city" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">City</Label>
              <Input
                id="city"
                name="city"
                value={form.additionalInfo.city}
                onChange={e => updateAdditionalInfo('city', e.target.value)}
                placeholder="City"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="country" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Country</Label>
              <Input
                id="country"
                name="country"
                value={form.additionalInfo.country}
                onChange={e => updateAdditionalInfo('country', e.target.value)}
                placeholder="Country"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="postalCode" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={form.additionalInfo.postalCode}
                onChange={e => updateAdditionalInfo('postalCode', e.target.value)}
                placeholder="Postal Code"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={form.additionalInfo.bio}
                onChange={e => updateAdditionalInfo('bio', e.target.value)}
                placeholder="Brief description about the user"
                className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30 min-h-25"
              />
            </div>
          </div>
        </form>
        {/* Sticky footer with Save/Cancel */}
        <div className="flex gap-4 px-10 py-6 border-t border-border bg-white dark:bg-background sticky bottom-0 z-10">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 font-semibold py-3 text-base"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onSave({ ...user, ...form })}
            className="flex-1 font-semibold py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
