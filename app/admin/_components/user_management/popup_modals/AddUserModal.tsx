import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}

export default function AddUserModal({ open, onClose, onSave }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-background rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="px-10 py-12 space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Add User</h2>
            <p className="text-muted-foreground mb-8">Create a new user account with full credentials</p>
            <div className="space-y-6">
              <div>
                <Label htmlFor="username" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter username"
                  className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <Label htmlFor="email" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30 pr-12"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                  className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm focus:ring-2 focus:ring-primary/30 pr-12"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div>
                <Label htmlFor="role" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">User Role</Label>
                <Select value={formData.role} onValueChange={value => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role" className="mt-2 bg-background border-none rounded-xl px-5 py-3 text-base shadow-sm w-full focus:ring-2 focus:ring-primary/30">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="w-full min-w-55">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="pUser">Premium User</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 font-semibold py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 font-semibold py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
