import React from "react";
import { Button } from "@/components/ui/button";
import { getFullImageUrl } from "@/lib/utils/image-util";

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// Helper function to get role badge
const getRoleBadge = (role: string) => {
  const badges = {
    user: { bg: 'bg-primary/10', text: 'text-primary' },
    admin: { bg: 'bg-secondary/10', text: 'text-secondary' },
    artist: { bg: 'bg-accent/10', text: 'text-accent' },
    puser: { bg: 'bg-success/10', text: 'text-success' },
  };
  return badges[role.toLowerCase() as keyof typeof badges] || badges.user;
};

interface UserProfileModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export default function UserProfileModal({ user, open, onClose, onEdit, onDelete }: UserProfileModalProps) {
  if (!open || !user) return null;

  const roleBadge = getRoleBadge(user.role || 'user');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">User Profile</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">&times;</button>
        </div>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            {user.profilePicture ? (
              <img src={getFullImageUrl(user.profilePicture) || ""} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl border-4 border-primary/20">
                {getInitials(user.name || user.email)}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold text-foreground">{user.name || user.username || user.userName || user.fullName || 'N/A'}</h4>
              <p className="text-muted-foreground">{user.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mt-2 ${roleBadge.bg} ${roleBadge.text}`}>
                {user.role || 'User'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm col-span-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">MongoDB ID</p>
              <p className="text-sm font-mono text-foreground break-all">{user._id || user.id || 'N/A'}</p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Role</p>
              <p className="text-sm font-semibold text-foreground">{user.role || 'User'}</p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Plan</p>
              <p className="text-sm font-semibold text-foreground">{user.plan || 'Free Tier'}</p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Join Date</p>
              <p className="text-sm font-semibold text-foreground">
                {user.joinDate || user.createdAt || user.created_at ? new Date(user.joinDate || user.createdAt || user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-foreground">
                {user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Additional Information Section */}
          {(user.additionalInfo || user.phone || user.country || user.bio) && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {(user.additionalInfo?.phoneNumber || user.phone) && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Phone</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo?.phoneNumber || user.phone}</p>
                  </div>
                )}
                {user.additionalInfo?.gender && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Gender</p>
                    <p className="text-sm font-semibold text-foreground capitalize">{user.additionalInfo.gender}</p>
                  </div>
                )}
                {user.additionalInfo?.dateOfBirth && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Date of Birth</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(user.additionalInfo.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.additionalInfo?.age && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Age</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo.age} years</p>
                  </div>
                )}
                {user.additionalInfo?.address && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm col-span-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Address</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo.address}</p>
                  </div>
                )}
                {user.additionalInfo?.city && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">City</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo.city}</p>
                  </div>
                )}
                {(user.additionalInfo?.country || user.country) && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Country</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo?.country || user.country}</p>
                  </div>
                )}
                {user.additionalInfo?.postalCode && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Postal Code</p>
                    <p className="text-sm font-semibold text-foreground">{user.additionalInfo.postalCode}</p>
                  </div>
                )}
                {(user.additionalInfo?.bio || user.bio) && (
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm col-span-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Bio</p>
                    <p className="text-sm text-foreground">{user.additionalInfo?.bio || user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {user.role?.toLowerCase() !== 'admin' && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => { onClose(); onEdit(user); }}
                className="flex-1"
              >
                Edit User
              </Button>
              <Button
                onClick={() => { onClose(); onDelete(user); }}
                variant="destructive"
                className="flex-1"
              >
                Delete User
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
