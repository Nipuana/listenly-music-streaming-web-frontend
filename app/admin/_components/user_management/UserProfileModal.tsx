import React from "react";

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
    user: { bg: 'bg-blue-100', text: 'text-blue-700' },
    admin: { bg: 'bg-purple-100', text: 'text-purple-700' },
    artist: { bg: 'bg-green-100', text: 'text-green-700' },
    puser: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#283F83]">User Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4 pb-6 border-b">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-blue-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#283F83] to-[#476FE9] flex items-center justify-center text-white font-bold text-xl border-4 border-blue-100">
                {getInitials(user.name || user.email)}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold text-[#283F83]">{user.name || user.username || user.userName || user.fullName || 'N/A'}</h4>
              <p className="text-slate-600">{user.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mt-2 ${roleBadge.bg} ${roleBadge.text}`}>
                {user.role || 'User'}
              </span>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl col-span-2">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">MongoDB ID</p>
              <p className="text-sm font-mono text-[#283F83] break-all">{user._id || user.id || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Role</p>
              <p className="text-sm font-semibold text-[#283F83]">{user.role || 'User'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Plan</p>
              <p className="text-sm font-semibold text-[#283F83]">{user.plan || 'Free Tier'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Join Date</p>
              <p className="text-sm font-semibold text-[#283F83]">
                {user.joinDate || user.createdAt || user.created_at ? new Date(user.joinDate || user.createdAt || user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-[#283F83]">
                {user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Additional Information Section */}
          {(user.additionalInfo || user.phone || user.country || user.bio) && (
            <div>
              <h4 className="text-lg font-semibold text-[#283F83] mb-3">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {(user.additionalInfo?.phoneNumber || user.phone) && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Phone</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo?.phoneNumber || user.phone}</p>
                  </div>
                )}
                {user.additionalInfo?.gender && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Gender</p>
                    <p className="text-sm font-semibold text-[#283F83] capitalize">{user.additionalInfo.gender}</p>
                  </div>
                )}
                {user.additionalInfo?.dateOfBirth && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Date of Birth</p>
                    <p className="text-sm font-semibold text-[#283F83]">
                      {new Date(user.additionalInfo.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.additionalInfo?.age && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Age</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo.age} years</p>
                  </div>
                )}
                {user.additionalInfo?.address && (
                  <div className="bg-slate-50 p-4 rounded-xl col-span-2">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Address</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo.address}</p>
                  </div>
                )}
                {user.additionalInfo?.city && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">City</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo.city}</p>
                  </div>
                )}
                {(user.additionalInfo?.country || user.country) && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Country</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo?.country || user.country}</p>
                  </div>
                )}
                {user.additionalInfo?.postalCode && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Postal Code</p>
                    <p className="text-sm font-semibold text-[#283F83]">{user.additionalInfo.postalCode}</p>
                  </div>
                )}
                {(user.additionalInfo?.bio || user.bio) && (
                  <div className="bg-slate-50 p-4 rounded-xl col-span-2">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Bio</p>
                    <p className="text-sm text-slate-700">{user.additionalInfo?.bio || user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {user.role?.toLowerCase() !== 'admin' && (
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => { onClose(); onEdit(user); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Edit User
              </button>
              <button 
                onClick={() => { onClose(); onDelete(user); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
