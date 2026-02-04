import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Trash2, Users, ShieldCheck, Mic2, Crown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleGetAllUsers, handleUpdateUser, handleDeleteUser, handleCreateUser } from "@/lib/actions/admin-actions";
import UserEditModal from "./UserEditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import UserProfileModal from "./UserProfileModal";
import AddUserModal from "./AddUserModal";

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// Helper function to get role badge color
const getRoleBadge = (role: string) => {
  const badges = {
    user: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-200', icon: Users },
    admin: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-200', icon: ShieldCheck },
    artist: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-700 dark:text-pink-200', icon: Mic2 },
    puser: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-200', icon: Crown },
  };
  return badges[role?.toLowerCase() as keyof typeof badges] || badges.user;
};

export default function UserManagementSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [viewUser, setViewUser] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const result = await handleGetAllUsers();
        if (result.success) {
          setUsers(result.data);
        } else {
          toast.error(result.message || "Failed to fetch users");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleEdit = useCallback((user: any) => {
    setEditUser(user);
    setEditOpen(true);
  }, []);

  const handleViewUser = useCallback((user: any) => {
    setViewUser(user);
    setViewOpen(true);
  }, []);

  const handleDeleteClick = useCallback((user: any) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      const result = await handleDeleteUser(deleteUser.id);
      if (result.success) {
        setUsers(users.filter(u => u.id !== deleteUser.id));
        setDeleteOpen(false);
        toast.error(`${deleteUser.name} has been deleted`, {
          icon: <Trash2 className="w-5 h-5 text-destructive" />,
          autoClose: 3000,
        });
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  }, [users, deleteUser]);

  const handleSave = useCallback(async (updated: any) => {
    try {
      const result = await handleUpdateUser(updated.id, updated);
      if (result.success) {
        setUsers(users.map(u => u.id === updated.id ? result.data : u));
        setEditOpen(false);
        toast.success(`${updated.name} has been updated successfully`, {
          autoClose: 3000,
        });
      } else {
        toast.error(result.message || "Failed to update user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  }, [users]);

  const handleAddUser = useCallback(async (userData: any) => {
    try {
      const result = await handleCreateUser(userData);
      if (result.success) {
        setUsers([...users, result.data]);
        setAddOpen(false);
        toast.success(`${userData.username} has been created successfully`, {
          autoClose: 3000,
        });
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  }, [users]);

  // Filter users based on role and search (optimized with early exit)
  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    // Filter by role (O(n) but necessary)
    if (roleFilter !== 'all') {
      const targetRole = roleFilter.toLowerCase();
      filtered = filtered.filter(user => user.role?.toLowerCase() === targetRole);
    }
    
    // Filter by search query (O(n) with early exit optimization)
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(user => {
        // Early exit: check email first (usually shorter string)
        const email = user.email?.toLowerCase() || '';
        if (email.includes(query)) return true;
        
        // Check name only if email didn't match
        const name = (user.name || user.username || user.userName || user.fullName || '').toLowerCase();
        return name.includes(query);
      });
    }
    
    return filtered;
  }, [users, roleFilter, debouncedSearch]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, debouncedSearch]);

  // Count by role
  const roleCounts = useMemo(() => {
    const counts: { all: number; user: number; admin: number; artist: number } = { all: users.length, user: 0, admin: 0, artist: 0 };
    users.forEach(u => {
      const role = u.role?.toLowerCase();
      if (role === 'user' || role === 'admin' || role === 'artist') {
        counts[role as 'user' | 'admin' | 'artist']++;
      }
    });
    return counts;
  }, [users]);

  return (
    <section className="p-app-gutter">
      <h2 className="text-2xl font-bold mb-4 text-foreground">User Management</h2>
      <div className="bg-card rounded-2xl shadow-primary p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">User Directory</h3>
            <p className="text-muted-foreground text-sm mt-1">Manage your {users.length} registered users</p>
          </div>
          <Button 
            onClick={() => setAddOpen(true)}
            className="hover:scale-105"
          >
            Add User
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6 p-2 bg-muted rounded-xl">
          <button
            onClick={() => setRoleFilter('all')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              roleFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              All Users
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.all}</span>
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              roleFilter === 'user'
                ? 'bg-primary text-primary-foreground shadow-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Users
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.user}</span>
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              roleFilter === 'admin'
                ? 'bg-primary text-primary-foreground shadow-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Admins
              <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{roleCounts.admin}</span>
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('artist')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              roleFilter === 'artist'
                ? 'bg-primary text-primary-foreground shadow-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Mic2 className="w-4 h-4" />
              Artists
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.artist}</span>
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No users found for selected filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b-2 border-border">
                  <th className="py-4 px-4 font-semibold">Avatar</th>
                  <th className="py-4 px-4 font-semibold">Username</th>
                  <th className="py-4 px-4 font-semibold">Email</th>
                  <th className="py-4 px-4 font-semibold">Role</th>
                  <th className="py-4 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => {
                  const roleBadge = getRoleBadge(user.role || 'user');
                  const RoleIcon = roleBadge.icon;
                  return (
                    <tr 
                      key={user.id} 
                      onClick={() => handleViewUser(user)}
                      className="border-b last:border-b-0 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-border" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm border-2 border-border">
                            {getInitials(user.name || user.email)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-foreground text-sm">
                          {user.name || user.username || user.userName || user.fullName || user.email?.split('@')[0] || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${roleBadge.bg} ${roleBadge.text} border border-border shadow-sm`}>
                          <RoleIcon className="w-4 h-4" />
                          <span className="capitalize">{user.role || 'User'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          {user.role?.toLowerCase() === 'admin' ? (
                            <span className="text-xs text-muted-foreground italic px-4 py-2">Protected Account</span>
                          ) : (
                            <>
                              <Button
                                onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                                variant="secondary"
                                size="sm"
                                className="font-semibold"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}
                                variant="destructive"
                                size="sm"
                                className="font-semibold"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && filteredUsers.length > usersPerPage && (
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground shadow-primary'
                        : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      <AddUserModal 
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddUser}
      />
      <UserProfileModal 
        user={viewUser} 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <UserEditModal user={editUser} open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} />
      <DeleteConfirmModal
        open={deleteOpen}
        userName={deleteUser?.name || ''}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
