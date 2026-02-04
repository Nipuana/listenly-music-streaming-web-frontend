import React, { useState } from "react";
import { Users, ShieldCheck, Mic2, Crown } from "lucide-react";
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
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border bg-muted/40">
          <h3 className="text-2xl font-bold text-foreground">Add New User</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl px-2 py-1 rounded-lg hover:bg-accent transition-colors">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="font-semibold">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="mt-2 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-semibold">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="mt-2 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-semibold">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Enter password (min 6 characters)"
                className="mt-2 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="role" className="font-semibold">Role <span className="text-destructive">*</span></Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="role" className="mt-2 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base shadow-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="pUser">Premium User</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-6">
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
              className="flex-1 font-semibold py-3 text-base"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
