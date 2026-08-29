import { useState, useMemo } from 'react';
import { Users as UsersIcon, Mail, MoreHorizontal, Shield, Plus, Search, Filter } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { toast } from '@/components/ui/Toast';
import { timeAgo, classNames } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AppUser, UserRole, UserStatus } from '@/types';

export function UsersPage() {
  const { users, stores, updateUserRole, updateUserStatus, addUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null); // For Profile Drawer

  // Derived metrics
  const owners = users.filter(u => u.role === 'owner').length;
  const managers = users.filter(u => u.role === 'manager').length;
  const staff = users.filter(u => u.role === 'staff').length;
  const activeCount = users.filter(u => u.status === 'active').length;

  const chartData = [
    { name: 'Owner', count: owners, fill: '#7C5CFF' },
    { name: 'Manager', count: managers, fill: '#64748B' },
    { name: 'Staff', count: staff, fill: '#475569' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  function handleRoleChange(user: AppUser, newRole: string) {
    updateUserRole(user.id, newRole as UserRole);
    toast('success', 'Role updated successfully.');
  }

  function handleStatusToggle(user: AppUser) {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    updateUserStatus(user.id, newStatus);
    toast('success', `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Users & Roles</h1>
          <p className="text-sm text-ink-400">Manage team members and permissions across stores.</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Add User
        </Button>
      </div>

      {/* KPI Cards & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KPI Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-ink-900 border-ink-800 flex flex-col justify-center text-center py-6">
            <div className="text-3xl font-bold text-white">{users.length}</div>
            <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">Total Users</div>
          </Card>
          <Card className="bg-ink-900 border-ink-800 flex flex-col justify-center text-center py-6">
            <div className="text-3xl font-bold text-steel-300">{owners}</div>
            <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">Owners</div>
          </Card>
          <Card className="bg-ink-900 border-ink-800 flex flex-col justify-center text-center py-6">
            <div className="text-3xl font-bold text-ink-200">{managers}</div>
            <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">Managers</div>
          </Card>
          <Card className="bg-ink-900 border-ink-800 flex flex-col justify-center text-center py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-success-500/10 rounded-bl-full" />
            <div className="text-3xl font-bold text-success-400">{activeCount}</div>
            <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">Active</div>
          </Card>
        </div>

        {/* Role Distribution Chart */}
        <Card className="lg:col-span-4 border-ink-800 bg-ink-900/80">
          <CardHeader title="Users by Role" subtitle="Current permission distribution" />
          <div className="h-[120px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card noPadding className="border-ink-800 bg-ink-900/50 shadow-2xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-ink-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="input-base w-full pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <Select 
              value={roleFilter} 
              onChange={setRoleFilter} 
              options={[
                {value: 'all', label: 'All Roles'},
                {value: 'owner', label: 'Owner'},
                {value: 'manager', label: 'Manager'},
                {value: 'staff', label: 'Staff'}
              ]} 
            />
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter} 
              options={[
                {value: 'all', label: 'All Status'},
                {value: 'active', label: 'Active'},
                {value: 'disabled', label: 'Inactive'}
              ]} 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink-950/80 text-ink-400 text-xs uppercase tracking-wider font-semibold border-b border-ink-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Store Access</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/60">
              {filteredUsers.length > 0 ? filteredUsers.map(user => {
                const storeText = user.storeIds.length === stores.length 
                  ? 'All Stores' 
                  : stores.filter(s => user.storeIds.includes(s.id)).map(s => s.shortName).join(', ') || 'None';

                return (
                  <tr key={user.id} className="hover:bg-ink-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-steel-700/20 text-steel-300 font-bold flex items-center justify-center border border-steel-700/30">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-ink-100">{user.name}</div>
                          <div className="text-xs text-ink-500 flex items-center gap-1.5 mt-0.5"><Mail size={10} /> {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <Select 
                          value={user.role} 
                          onChange={(v) => handleRoleChange(user, v)} 
                          options={[
                            {value: 'owner', label: 'Owner'},
                            {value: 'manager', label: 'Manager'},
                            {value: 'staff', label: 'Staff'}
                          ]} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-300 max-w-[200px] truncate" title={storeText}>
                      {storeText}
                    </td>
                    <td className="px-6 py-4">
                      <div className={classNames('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', user.status === 'active' ? 'bg-success-500/10 text-success-400 border border-success-500/20' : 'bg-ink-800 text-ink-400 border border-ink-700')}>
                        <span className={classNames('w-1.5 h-1.5 rounded-full', user.status === 'active' ? 'bg-success-400' : 'bg-ink-500')} />
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-400 text-xs">
                      {timeAgo(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Action Menu (Mocked as immediate buttons for simplicity & visibility) */}
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>Profile</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleStatusToggle(user)}>{user.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                      </div>
                      <div className="group-hover:hidden text-ink-600">
                        <MoreHorizontal size={20} className="ml-auto" />
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Profile Modal/Drawer (Simplified as overlay) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-ink-900 border border-ink-700 rounded-xl shadow-2xl w-full max-w-md animate-fade-in overflow-hidden">
            <div className="p-6 border-b border-ink-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Shield size={18} className="text-steel-400" /> User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="text-ink-400 hover:text-white"><Plus size={20} className="rotate-45" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-steel-700/20 text-steel-300 font-bold flex items-center justify-center border border-steel-700/30 text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                  <div className="text-sm text-ink-400 mt-0.5">{selectedUser.email}</div>
                  <div className="mt-2 text-xs uppercase tracking-widest font-bold text-steel-400">{selectedUser.role}</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-ink-800">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Status</span>
                  <span className={selectedUser.status === 'active' ? 'text-success-400' : 'text-ink-500'}>{selectedUser.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Last Active</span>
                  <span className="text-ink-200">{timeAgo(selectedUser.lastActive)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Store Access</span>
                  <span className="text-ink-200 text-right max-w-[200px] truncate">{selectedUser.storeIds.length === stores.length ? 'All Stores' : `${selectedUser.storeIds.length} Stores`}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-ink-800">
                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-3">Permissions</h4>
                <div className="space-y-2">
                  <PermissionRow label="View Dashboard" has={true} />
                  <PermissionRow label="View Alerts" has={true} />
                  <PermissionRow label="Manage Alerts" has={selectedUser.role === 'owner' || selectedUser.role === 'manager'} />
                  <PermissionRow label="View Cameras" has={true} />
                  <PermissionRow label="Configure Cameras" has={selectedUser.role === 'owner' || selectedUser.role === 'manager'} />
                  <PermissionRow label="Manage Users" has={selectedUser.role === 'owner'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-ink-900 border border-ink-700 rounded-xl shadow-2xl w-full max-w-md animate-fade-in p-6">
            <h2 className="text-lg font-bold text-white mb-6">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-300 mb-1.5">Full Name</label>
                <input type="text" className="input-base w-full" placeholder="John Doe" id="newName" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-300 mb-1.5">Email</label>
                <input type="email" className="input-base w-full" placeholder="john@example.com" id="newEmail" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-300 mb-1.5">Role</label>
                <Select value="staff" onChange={() => {}} options={[{value: 'owner', label: 'Owner'}, {value: 'manager', label: 'Manager'}, {value: 'staff', label: 'Staff'}]} />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="primary" className="flex-1" onClick={() => {
                toast('success', 'User created successfully.');
                setIsAddModalOpen(false);
              }}>Create User</Button>
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionRow({ label, has }: { label: string, has: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={classNames('w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold', has ? 'bg-steel-500/20 text-steel-400' : 'bg-ink-800 text-ink-600')}>
        {has ? '✓' : '—'}
      </div>
      <span className={classNames('text-sm', has ? 'text-ink-200' : 'text-ink-500')}>{label}</span>
    </div>
  );
}
