import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Store, Bell, Shield, Palette, Save, Check, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
});

type Tab = 'store' | 'notifications' | 'security';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('store');
  const [saved, setSaved] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ERHA Trade Link International',
    tagline: 'Power Banks for Every Journey',
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

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 2000);
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
            <h3 className="font-bold text-slate-800">Change Password</h3>
            {[
              { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
              { key: 'newPassword', label: 'New Password', placeholder: '••••••••' },
              { key: 'confirmPassword', label: 'Confirm New Password', placeholder: '••••••••' },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{item.label}</label>
                <input type="password" value={secSettings[item.key as keyof typeof secSettings] as string}
                  onChange={e => setSecSettings(s => ({ ...s, [item.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={item.placeholder} />
              </div>
            ))}
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
