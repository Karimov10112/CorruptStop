import { Header } from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const monthlyData = [
  { month: 'Okt', total: 187, verified: 156, serious: 43 },
  { month: 'Noy', total: 234, verified: 198, serious: 67 },
  { month: 'Dek', total: 312, verified: 267, serious: 89 },
  { month: 'Yan', total: 398, verified: 342, serious: 112 },
  { month: 'Fev', total: 456, verified: 389, serious: 134 },
  { month: 'Mar', total: 521, verified: 445, serious: 156 },
  { month: 'Apr', total: 589, verified: 503, serious: 178 },
];

const sectorData = [
  { name: "Sog'liqni saqlash", value: 437, color: '#1D9E75' },
  { name: "Ta'lim", value: 389, color: '#D85A30' },
  { name: 'Qurilish', value: 312, color: '#BA7517' },
  { name: 'Davlat xaridlari', value: 298, color: '#6366F1' },
  { name: "Yo'l harakati", value: 234, color: '#EC4899' },
  { name: 'Kommunal', value: 198, color: '#8B5CF6' },
  { name: 'Boshqa', value: 179, color: '#9CA3AF' },
];

const cityData = [
  { city: 'Toshkent', count: 847 },
  { city: 'Samarqand', count: 423 },
  { city: 'Buxoro', count: 312 },
  { city: 'Andijon', count: 289 },
  { city: 'Namangan', count: 267 },
  { city: 'Farg\'ona', count: 234 },
  { city: 'Qashqadaryo', count: 198 },
  { city: 'Surxondaryo', count: 156 },
  { city: 'Xorazm', count: 121 },
];

export function StatsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Statistika
          </h1>
          <p className="text-muted-foreground">Real vaqt korrupsiya shikoyatlari tahlili</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Jami shikoyatlar</p>
                <h3 className="text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>2,847</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-trust-teal" />
              <span className="text-trust-teal">+12%</span>
              <span className="text-muted-foreground">bu oy</span>
            </div>
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData.slice(-7)}>
                  <Line type="monotone" dataKey="total" stroke="#D85A30" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bu hafta</p>
                <h3 className="text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>143</h3>
              </div>
              <div className="p-2 bg-trust-teal/10 rounded-lg">
                <Calendar className="w-5 h-5 text-trust-teal" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-trust-teal" />
              <span className="text-trust-teal">+34%</span>
              <span className="text-muted-foreground">o'tgan haftaga nisbatan</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tasdiqlangan</p>
                <h3 className="text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>89%</h3>
              </div>
              <div className="p-2 bg-warning-amber/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-warning-amber" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Sifat ko'rsatkichi</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eng ko'p soha</p>
                <h3 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Ta'lim</h3>
              </div>
              <div className="text-3xl">🏥</div>
            </div>
            <p className="text-sm text-muted-foreground">437 shikoyat</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Soha bo'yicha taqsimot
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Top 9 shahar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="city" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#D85A30" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Full Width */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
              12 oylik dinamika
            </h3>
            <div className="flex gap-2">
              {['1H', '3H', '6H', '1Y', 'Barchasi'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-xs rounded-lg hover:bg-muted transition-colors border border-border"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#D85A30" strokeWidth={3} name="Jami" />
              <Line type="monotone" dataKey="verified" stroke="#1D9E75" strokeWidth={3} name="Tasdiqlangan" />
              <Line type="monotone" dataKey="serious" stroke="#A32D2D" strokeWidth={3} name="Jiddiy" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
              So'nggi faoliyat
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Soha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tuman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Holat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { date: '2026-04-24', sector: "Ta'lim", location: 'Toshkent', status: 'verified' },
                  { date: '2026-04-24', sector: 'Qurilish', location: 'Samarqand', status: 'reviewing' },
                  { date: '2026-04-23', sector: "Sog'liqni saqlash", location: 'Buxoro', status: 'verified' },
                  { date: '2026-04-23', sector: 'Davlat xaridlari', location: 'Andijon', status: 'pending' },
                  { date: '2026-04-22', sector: 'Kommunal', location: 'Namangan', status: 'verified' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.sector}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'verified' ? (
                        <span className="px-3 py-1 text-xs bg-trust-light text-trust-teal rounded-full">
                          Tasdiqlangan
                        </span>
                      ) : item.status === 'reviewing' ? (
                        <span className="px-3 py-1 text-xs bg-warning-light text-warning-amber rounded-full">
                          Tekshirilmoqda
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs bg-coral-light text-primary rounded-full">
                          Yangi
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <button className="text-sm text-muted-foreground hover:text-primary">
              ← Oldingi
            </button>
            <span className="text-sm text-muted-foreground">1-5 of 2,847</span>
            <button className="text-sm text-muted-foreground hover:text-primary">
              Keyingi →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
