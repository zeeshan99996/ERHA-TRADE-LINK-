import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Store, Bell, Shield, Palette, Save, Check, Mail, Phone, MapPin, Globe, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/supabase';

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
});

type Tab = 'store' | 'notifications' | 'security';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('store');
  const [saved, setSaved] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ERHA Trade Link International',
    tagline: 'Premium Tech for Every Journey',
    email: 'erhatradelinkinternational@gmail.com',
    phone: '03023333499',
    address: 'Pace N Pace Mall Near Chaseup, Chungi#6, Multan, Pakistan',
    currency: 'PKR',
    language: 'en',
    timezone: 'Asia/Karachi',
    maintenanceMode: false,
    allowReviews: true,
    autoConfirmOrders: false,
  });

  const [notifSettings, setNotifSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newReview: false,
    dailyReport: false,
    whatsappNotifications: true,
    emailNotifications: true,
  });

  const [secSettings, setSecSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    sessionTimeout: '60',
  });

  const [currentAdminEmail, setCurrentAdminEmail] = useState(() => {
    if (typeof window === 'undefined') return 'muhammadzeeshan0477@gmail.com';
    return sessionStorage.getItem('erha_admin_email') || localStorage.getItem('erha_admin_email') || 'muhammadzeeshan0477@gmail.com';
  });
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailVerifyPass, setEmailVerifyPass] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showEmailVerifyPass, setShowEmailVerifyPass] = useState(false);

  // Register New Admin states
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmailField, setNewAdminEmailField] = useState('');
  const [newAdminPasswordField, setNewAdminPasswordField] = useState('');
  const [newAdminConfirmPasswordField, setNewAdminConfirmPasswordField] = useState('');
  const [newAdminRoleField, setNewAdminRoleField] = useState<'Super Admin' | 'Manager' | 'Staff'>('Super Admin');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);

  const handleRegisterNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmailField || !newAdminPasswordField || !newAdminConfirmPasswordField) {
      toast.error('Please fill in all registration fields.');
      return;
    }
    if (newAdminPasswordField !== newAdminConfirmPasswordField) {
      toast.error('Passwords do not match.');
      return;
    }

    const hasNum = /\d/.test(newAdminPasswordField);
    const hasSpec = /[^a-zA-Z0-9]/.test(newAdminPasswordField);
    if (newAdminPasswordField.length < 8 || !hasNum || !hasSpec) {
      toast.error('Password must be at least 8 characters, and contain a number and special symbol.');
      return;
    }

    try {
      const res = await db.signupAdmin({
        name: newAdminName,
        email: newAdminEmailField,
        password: newAdminPasswordField,
        role: newAdminRoleField,
      });

      if (res.success) {
        toast.success(`Admin account for ${newAdminName} created successfully!`);
        setNewAdminName('');
        setNewAdminEmailField('');
        setNewAdminPasswordField('');
        setNewAdminConfirmPasswordField('');
        setNewAdminRoleField('Super Admin');
      } else {
        toast.error(res.message || 'Failed to register new admin account.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while registering the admin.');
    }
  };

  const handleSave = async () => {
    if (activeTab === 'security') {
      let securityUpdated = false;

      // Check if trying to change password
      if (secSettings.currentPassword || secSettings.newPassword || secSettings.confirmPassword) {
        if (!secSettings.currentPassword || !secSettings.newPassword || !secSettings.confirmPassword) {
          toast.error('Please fill in all password fields.');
          return;
        }
        if (secSettings.newPassword !== secSettings.confirmPassword) {
          toast.error('New passwords do not match.');
          return;
        }
        
        // Validate password strength
        const hasNum = /\d/.test(secSettings.newPassword);
        const hasSpec = /[^a-zA-Z0-9]/.test(secSettings.newPassword);
        if (secSettings.newPassword.length < 8 || !hasNum || !hasSpec) {
          toast.error('New password must be at least 8 characters, and contain a number and special symbol.');
          return;
        }

        // Always re-read email from storage at the moment of submission (most reliable)
        const resolvedEmail = (typeof window !== 'undefined')
          ? (sessionStorage.getItem('erha_admin_email') || localStorage.getItem('erha_admin_email') || currentAdminEmail)
          : currentAdminEmail;
        console.log('[ChangePassword] Using email:', resolvedEmail);

        const res = await db.changeAdminPassword(resolvedEmail, secSettings.currentPassword, secSettings.newPassword);
        console.log('[ChangePassword] Result:', res);
        if (res.success) {
          toast.success('Admin password updated successfully!');
          setSecSettings(s => ({ ...s, currentPassword: '', newPassword: '', confirmPassword: '' }));
          setCurrentAdminEmail(resolvedEmail); // Sync state too
          securityUpdated = true;
        } else {
          toast.error(res.message || 'Failed to update admin password.');
          return;
        }
      }

      // Check if trying to change email
      if (newAdminEmail) {
        if (!emailVerifyPass) {
          toast.error('Please enter your current password to verify identity.');
          return;
        }
        const res = await db.changeAdminEmail(currentAdminEmail, newAdminEmail, emailVerifyPass);
        if (res.success) {
          if (sessionStorage.getItem('erha_admin_email')) {
            sessionStorage.setItem('erha_admin_email', newAdminEmail);
          }
          if (localStorage.getItem('erha_admin_email')) {
            localStorage.setItem('erha_admin_email', newAdminEmail);
          }
          setCurrentAdminEmail(newAdminEmail);
          setNewAdminEmail('');
          setEmailVerifyPass('');
          toast.success('Admin email updated successfully!');
          securityUpdated = true;
        } else {
          toast.error(res.message || 'Failed to update admin email.');
          return;
        }
      }

      if (!securityUpdated && !secSettings.currentPassword && !newAdminEmail) {
        // Just general options updated
        setSaved(true);
        toast.success('Security settings saved successfully!');
        setTimeout(() => setSaved(false), 2000);
      }
    } else {
      // For store or notifications
      setSaved(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'store', label: 'Store', icon: <Store size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { key: 'security', label: 'Security', icon: <Shield size={16} /> },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === t.key ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            style={activeTab === t.key ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {activeTab === 'store' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800">Store Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Store Name</label>
                <input type="text" value={storeSettings.storeName} onChange={e => setStoreSettings(s => ({ ...s, storeName: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tagline</label>
                <input type="text" value={storeSettings.tagline} onChange={e => setStoreSettings(s => ({ ...s, tagline: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1"><Mail size={12} className="inline mr-1" />Email</label>
                <input type="email" value={storeSettings.email} onChange={e => setStoreSettings(s => ({ ...s, email: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1"><Phone size={12} className="inline mr-1" />Phone</label>
                <input type="tel" value={storeSettings.phone} onChange={e => setStoreSettings(s => ({ ...s, phone: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1"><MapPin size={12} className="inline mr-1" />Address</label>
              <textarea rows={2} value={storeSettings.address} onChange={e => setStoreSettings(s => ({ ...s, address: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Currency</label>
                <select value={storeSettings.currency} onChange={e => setStoreSettings(s => ({ ...s, currency: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Timezone</label>
                <select value={storeSettings.timezone} onChange={e => setStoreSettings(s => ({ ...s, timezone: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable the storefront for visitors' },
              { key: 'allowReviews', label: 'Allow Customer Reviews', desc: 'Let customers submit product reviews' },
              { key: 'autoConfirmOrders', label: 'Auto-confirm Orders', desc: 'Automatically confirm orders on placement' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-t border-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <button onClick={() => setStoreSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${storeSettings[item.key as keyof typeof storeSettings] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${storeSettings[item.key as keyof typeof storeSettings] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/50 rounded-2xl border border-red-100 p-5 space-y-4">
            <h3 className="font-bold text-red-800">Danger Zone / Developer Tools</h3>
            
            <div className="space-y-2 border-b border-red-100 pb-4">
              <p className="text-xs text-red-700 font-semibold">Option A: Clear Local Storage Cache</p>
              <p className="text-xs text-red-600">
                Resets the local fallback state of the application stored in your browser's localStorage (e.g. products, categories, orders).
              </p>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete all local database fallback records? This action is irreversible.")) {
                    localStorage.removeItem('erha_products_v5');
                    localStorage.removeItem('erha_categories_v2');
                    localStorage.removeItem('erha_orders_v2');
                    localStorage.removeItem('erha_customers_v2');
                    localStorage.removeItem('erha_coupons_v2');
                    localStorage.removeItem('erha_expenses_v2');
                    localStorage.removeItem('erha_payments_v2');
                    localStorage.removeItem('erha_notifications_v2');
                    localStorage.removeItem('erha_admins_local_v2');
                    toast.success("Local database fallback cleared! Refreshing...");
                    setTimeout(() => window.location.reload(), 1500);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
              >
                Clear Local Storage Database
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-red-700 font-semibold">Option B: Purge Active Database Transactions (Orders & Customers)</p>
              <p className="text-xs text-red-600">
                Permanently deletes all customers, orders, transaction payments, and notification logs from the active backend database (Supabase). This will clean up the lists for fresh testing.
              </p>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete ALL order and customer data from the database? This will permanently wipe all transactions, clients, payments, and notifications. This action is irreversible!")) {
                    try {
                      toast.loading("Purging transaction and customer records...");
                      await db.clearAllOrdersAndCustomers();
                      toast.dismiss();
                      toast.success("Database successfully cleared of all order and customer data!");
                      setTimeout(() => window.location.reload(), 1500);
                    } catch (err: any) {
                      toast.dismiss();
                      toast.error("Failed to clear database: " + (err?.message || err));
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
              >
                Purge All Orders & Customers
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1">
          <h3 className="font-bold text-slate-800 mb-4">Notification Preferences</h3>
          {[
            { key: 'orderConfirmation', label: 'Order Confirmation', desc: 'Notify when a new order is placed' },
            { key: 'orderShipped', label: 'Order Shipped', desc: 'Notify when an order is shipped' },
            { key: 'orderDelivered', label: 'Order Delivered', desc: 'Notify when an order is delivered' },
            { key: 'lowStock', label: 'Low Stock Alert', desc: 'Notify when product stock is low' },
            { key: 'newReview', label: 'New Review', desc: 'Notify when a customer submits a review' },
            { key: 'dailyReport', label: 'Daily Report', desc: 'Receive a daily sales summary' },
            { key: 'whatsappNotifications', label: 'WhatsApp Notifications', desc: 'Send WhatsApp notifications for orders' },
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications for events' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button onClick={() => setNotifSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[item.key as keyof typeof notifSettings] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings[item.key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Change Password</h3>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
                {currentAdminEmail}
              </span>
            </div>
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={secSettings.currentPassword}
                  onChange={e => setSecSettings(s => ({ ...s, currentPassword: e.target.value }))}
                  className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={secSettings.newPassword}
                  onChange={e => setSecSettings(s => ({ ...s, newPassword: e.target.value }))}
                  className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={secSettings.confirmPassword}
                  onChange={e => setSecSettings(s => ({ ...s, confirmPassword: e.target.value }))}
                  className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800">Update Admin Email</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Current Email</label>
              <input type="email" disabled value={currentAdminEmail}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 bg-slate-50 text-slate-400 rounded-xl outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">New Email Address</label>
              <input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="newemail@erha.pk" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Verify Password</label>
              <div className="relative">
                <input
                  type={showEmailVerifyPass ? 'text' : 'password'}
                  value={emailVerifyPass}
                  onChange={e => setEmailVerifyPass(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailVerifyPass(!showEmailVerifyPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showEmailVerifyPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800">Register New Admin Account</h3>
            <form onSubmit={handleRegisterNewAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@erha.pk"
                  value={newAdminEmailField}
                  onChange={e => setNewAdminEmailField(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showNewAdminPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 8 chars"
                      value={newAdminPasswordField}
                      onChange={e => setNewAdminPasswordField(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
                  <input
                    type={showNewAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newAdminConfirmPasswordField}
                    onChange={e => setNewAdminConfirmPasswordField(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Admin Role</label>
                <select
                  value={newAdminRoleField}
                  onChange={e => setNewAdminRoleField(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow hover:shadow-md bg-indigo-650 hover:bg-indigo-600"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  Create Admin User
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800">Security Options</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
              </div>
              <button onClick={() => setSecSettings(s => ({ ...s, twoFactor: !s.twoFactor }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${secSettings.twoFactor ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${secSettings.twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Session Timeout (minutes)</label>
              <select value={secSettings.sessionTimeout} onChange={e => setSecSettings(s => ({ ...s, sessionTimeout: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {['15', '30', '60', '120', '240'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-md hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
