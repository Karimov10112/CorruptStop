import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export function HokimWatchStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/hw/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hokimwatch" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">HokimWatch Statistikasi</h1>
            <p className="text-slate-500">Davlat xaridlari va loyihalari bo'yicha jamoatchilik nazorati natijalari</p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Nazoratdagi Loyihalar</p>
              <h3 className="text-3xl font-black text-slate-900">{stats?.totalProjects || 0} ta</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Nazoratdagi Byudjet</p>
              <h3 className="text-3xl font-black text-slate-900">
                {stats ? (stats.totalBudget / 1000000000).toFixed(1) : 0} mlrd
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">O'rtacha Sifat Bahosi</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-black text-slate-900">{stats?.averageScore || 0}</h3>
                <span className="text-yellow-500 text-xl mb-1">★</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="relative">
              <p className="text-red-800/70 text-sm font-medium mb-1">Prokuraturaga Yuborilgan</p>
              <h3 className="text-3xl font-black text-red-600">{stats?.escalations || 0} ta</h3>
            </div>
          </div>
        </div>

        {/* Charts Mockup (Recharts o'rniga oddiy UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-6">Viloyatlar Reytingi</h3>
            <div className="space-y-4">
              {['Toshkent sh.', 'Samarqand v.', 'Farg\'ona v.', 'Andijon v.', 'Qashqadaryo v.'].map((region, idx) => (
                <div key={region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{region}</span>
                    <span className="text-slate-500">{(5 - idx * 0.4).toFixed(1)} ★</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${100 - idx * 15}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-6">Sohalar Bo'yicha Byudjet</h3>
            <div className="space-y-4">
              {[
                { name: "Yo'l qurilishi", val: 45, color: "bg-blue-500" },
                { name: "Ta'lim (Maktablar)", val: 25, color: "bg-emerald-500" },
                { name: "Sog'liqni saqlash", val: 20, color: "bg-amber-500" },
                { name: "Kommunal soha", val: 10, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
