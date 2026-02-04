import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card rounded-2xl shadow-primary p-8 max-w-5xl w-full mx-4 max-h-screen overflow-y-auto animate-in zoom-in-95 duration-200 border border-border">
        <h3 className="text-2xl font-bold mb-6 text-foreground">Edit User</h3>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Additional Information (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.additionalInfo.phoneNumber}
                  onChange={e => updateAdditionalInfo('phoneNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.additionalInfo.gender} onValueChange={(value) => updateAdditionalInfo('gender', value)}>
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
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.additionalInfo.dateOfBirth}
                  onChange={e => updateAdditionalInfo('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={form.additionalInfo.age}
                  onChange={e => updateAdditionalInfo('age', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.additionalInfo.address}
                  onChange={e => updateAdditionalInfo('address', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.additionalInfo.city}
                  onChange={e => updateAdditionalInfo('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.additionalInfo.country}
                  onChange={e => updateAdditionalInfo('country', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={form.additionalInfo.postalCode}
                  onChange={e => updateAdditionalInfo('postalCode', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.additionalInfo.bio}
                  onChange={e => updateAdditionalInfo('bio', e.target.value)}
                  className="min-h-25"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
          <Button onClick={() => onSave({ ...user, ...form })} className="flex-1">Save</Button>
        </div>
      </div>
    </div>
  );
}
