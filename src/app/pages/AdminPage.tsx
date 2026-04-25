import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import {
  BarChart3,
  FileText,
  MapPin,
  BarChart,
  Settings,
  LogOut,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const mockReports = [
  { id: 'CS-2026-04847', date: '2026-04-24', sector: "Ta'lim", location: 'Toshkent, Yunusobod', description: 'Maktab direktori imtihon uchun pul...', status: 'new', priority: 'high' },
  { id: 'CS-2026-04846', date: '2026-04-24', sector: 'Qurilish', location: 'Samarqand', description: 'Qurilish ruxsati berish...', status: 'reviewing', priority: 'medium' },
  { id: 'CS-2026-04845', date: '2026-04-23', sector: "Sog'liqni saqlash", location: 'Buxoro', description: 'Shifoxonaga yotqizish uchun...', status: 'verified', priority: 'high' },
  { id: 'CS-2026-04844', date: '2026-04-23', sector: 'Davlat xaridlari', location: 'Andijon', description: 'Tender jarayonida...', status: 'rejected', priority: 'low' },
  { id: 'CS-2026-04843', date: '2026-04-22', sector: 'Kommunal xizmat', location: 'Namangan', description: 'Elektr energiyasi ulash...', status: 'verified', priority: 'medium' },
];

function Sidebar({ active, onNavigate, onLogout }: { active: string; onNavigate: (page: string) => void; onLogout: () => void }) {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'reports', icon: FileText, label: 'Shikoyatlar', badge: 12 },
    { id: 'map', icon: MapPin, label: 'Xarita' },
    { id: 'analytics', icon: BarChart, label: 'Hisobotlar' },
    { id: 'settings', icon: Settings, label: 'Sozlamalar' },
  ];

  return (
    <div className="w-60 bg-card border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white">🛡</span>
          </div>
          <span className="font-medium" style={{ fontFamily: 'var(--font-serif)' }}>CorruptStop</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground">admin@cs.uz</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </div>
  );
}

function ReportsTable() {
  const { reports, updateReportStatus } = useReports();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filter, setFilter] = useState('all');

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.status === (filter === 'new' ? 'pending' : filter));

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-warning-light', text: 'text-warning-amber', label: 'Yangi' },
      reviewing: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', label: 'Ko\'rib chiqilmoqda' },
      verified: { bg: 'bg-trust-light', text: 'text-trust-teal', label: 'Tasdiqlangan' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', label: 'Rad etilgan' },
    };
    const style = styles[status as keyof typeof styles];
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
              Shikoyatlar
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredReports.length} shikoyat topildi
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtr
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ID, manzil yoki tavsif bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg text-sm min-w-[150px]"
          >
            <option value="all">Barchasi</option>
            <option value="new">Yangi</option>
            <option value="reviewing">Ko'rib chiqilmoqda</option>
            <option value="verified">Tasdiqlangan</option>
            <option value="rejected">Rad etilgan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <input type="checkbox" className="rounded border-border" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sana
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Soha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Joylashuv
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tavsif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Holat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Harakatlar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-border" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono">{report.id}</span>
                  {report.priority === 'high' && (
                    <AlertTriangle className="inline w-3 h-3 text-danger-red ml-2" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {report.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {report.sector}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {report.location}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm truncate max-w-xs">{report.description}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                      title="Ko'rish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReportStatus(report.id, 'verified')}
                          className="p-1 hover:bg-trust-light rounded transition-colors"
                          title="Tasdiqlash"
                        >
                          <CheckCircle className="w-4 h-4 text-trust-teal" />
                        </button>
                        <button
                          onClick={() => updateReportStatus(report.id, 'rejected')}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Rad etish"
                        >
                          <XCircle className="w-4 h-4 text-danger-red" />
                        </button>
                      </>
                    )}
                    <button
                      className="p-1 hover:bg-muted rounded transition-colors"
                      title="Agentlikka yuborish"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Oldingi
        </button>
        <span className="text-sm text-muted-foreground">1-5 of {filteredReports.length}</span>
        <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
          Keyingi
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border sticky top-0 bg-card flex items-center justify-between">
              <h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
                Shikoyat Tafsilotlari
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID</p>
                  <p className="font-mono">{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sana</p>
                  <p>{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Soha</p>
                  <p>{selectedReport.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Holat</p>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Joylashuv</p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {selectedReport.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Tavsif</p>
                <p className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => { updateReportStatus(selectedReport.id, 'verified'); setSelectedReport(null); }}
                    className="flex-1 px-4 py-2 bg-trust-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => { updateReportStatus(selectedReport.id, 'rejected'); setSelectedReport(null); }}
                    className="flex-1 px-4 py-2 bg-danger-red text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Rad etish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('reports');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-warning-amber mx-auto mb-4" />
          <h2 className="text-2xl mb-4">Kirish taqiqlangan</h2>
          <p className="text-muted-foreground mb-6">Siz admin emasiz</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          logout();
          navigate('/');
        }}
      />
      <ReportsTable />
    </div>
  );
}
