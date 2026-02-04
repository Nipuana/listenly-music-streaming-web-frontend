import React from "react";

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full mx-4 max-h-screen overflow-y-auto animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold mb-6 text-[#283F83]">Edit User</h3>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-[#283F83] mb-4 pb-2 border-b">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Name</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Role</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="pUser">Premium User</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-semibold text-[#283F83] mb-4 pb-2 border-b">Additional Information (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.phoneNumber}
                  onChange={e => updateAdditionalInfo('phoneNumber', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Gender</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.gender}
                  onChange={e => updateAdditionalInfo('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.dateOfBirth}
                  onChange={e => updateAdditionalInfo('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Age</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.age}
                  onChange={e => updateAdditionalInfo('age', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Address</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.address}
                  onChange={e => updateAdditionalInfo('address', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">City</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.city}
                  onChange={e => updateAdditionalInfo('city', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Country</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.country}
                  onChange={e => updateAdditionalInfo('country', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Postal Code</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.additionalInfo.postalCode}
                  onChange={e => updateAdditionalInfo('postalCode', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Bio</label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-25"
                  value={form.additionalInfo.bio}
                  onChange={e => updateAdditionalInfo('bio', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all">Cancel</button>
          <button onClick={() => onSave({ ...user, ...form })} className="flex-1 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#283F83] to-[#476FE9] hover:opacity-90 text-white font-semibold shadow-lg shadow-blue-200 transition-all">Save</button>
        </div>
      </div>
    </div>
  );
}
