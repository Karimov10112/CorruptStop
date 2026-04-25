import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Header } from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { Filter, Download, X, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';

// Mock data
const mockReports = [
  { id: 1, lat: 41.2995, lng: 69.2401, sector: 'health', location: 'Toshkent, Yunusobod', description: 'Shifoxona bosh shifokori...', date: '2026-04-24', status: 'verified' },
  { id: 2, lat: 41.3111, lng: 69.2797, sector: 'education', location: 'Toshkent, Mirobod', description: 'Maktab direktori...', date: '2026-04-23', status: 'pending' },
  { id: 3, lat: 39.6542, lng: 66.9597, sector: 'construction', location: 'Samarqand', description: 'Qurilish ruxsati...', date: '2026-04-22', status: 'verified' },
  { id: 4, lat: 40.7696, lng: 72.3469, sector: 'procurement', location: 'Qo\'qon', description: 'Davlat xaridi...', date: '2026-04-21', status: 'reviewing' },
  { id: 5, lat: 41.5606, lng: 60.6175, sector: 'utilities', location: 'Urganch', description: 'Kommunal xizmat...', date: '2026-04-20', status: 'verified' },
];

const sectorColors: { [key: string]: string } = {
  health: '#1D9E75',
  education: '#D85A30',
  construction: '#BA7517',
  procurement: '#6366F1',
  traffic: '#EC4899',
  property: '#F59E0B',
  justice: '#4F46E5',
  tax: '#EF4444',
  sport: '#10B981',
  utilities: '#8B5CF6',
  social: '#F43F5E',
  labor: '#06B6D4',
  military: '#374151',
  other: '#6B7280',
};

const customIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMxMC40NzcyIDAgNiA0LjQ3NzE1IDYgMTBDNiAxNy41IDE2IDMwIDE2IDMwQzE2IDMwIDI2IDE3LjUgMjYgMTBDMjYgNC40NzcxNSAyMS41MjI4IDAgMTYgMFoiIGZpbGw9IiNENTVBMzAiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEwIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

const normalizeSector = (report: any) => {
  if (report.sector) return report.sector;
  const cat = report.category || "";
  if (cat.includes("Sog'liqni")) return 'health';
  if (cat.includes("Ta'lim")) return 'education';
  if (cat.includes("Qurilish")) return 'construction';
  if (cat.includes("xarid")) return 'procurement';
  if (cat.includes("Yo'l")) return 'traffic';
  if (cat.includes("Yer")) return 'property';
  if (cat.includes("Sud") || cat.includes("Adliya")) return 'justice';
  if (cat.includes("Soliq")) return 'tax';
  if (cat.includes("Sport")) return 'sport';
  if (cat.includes("Kommunal")) return 'utilities';
  if (cat.includes("yordam")) return 'social';
  if (cat.includes("Mehnat")) return 'labor';
  if (cat.includes("Harbiy")) return 'military';
  return 'other';
};

export function MapPage() {
  const { t, language } = useLanguage();
  const { reports } = useReports();
  const [filters, setFilters] = useState<{
    sectors: string[];
    dateRange: string;
    regions: string[];
    status: string;
  }>({
    sectors: [],
    dateRange: 'all',
    regions: [],
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Koordinata borligini tekshirish
      const lat = report.lat || (report.location && report.location.lat);
      const lng = report.lng || (report.location && report.location.lng);
      
      if (lat === undefined || lng === undefined) return false;

      const sector = normalizeSector(report);

      if (filters.sectors.length > 0 && !filters.sectors.includes(sector)) return false;
      if (filters.status !== 'all' && report.status !== filters.status) return false;
      return true;
    });
  }, [filters, reports]);

  const toggleSector = (sector: string) => {
    setFilters(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-80 border-r border-border bg-card overflow-y-auto transition-all ${showFilters ? '' : 'hidden lg:block'}`}>
          <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Filtrlar</h2>
              <button
                onClick={() => setFilters({ sectors: [], dateRange: 'all', regions: [], status: 'all' })}
                className="text-xs text-primary hover:underline"
              >
                Tozalash
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{filteredReports.length} shikoyat topildi</p>
          </div>

          <div className="p-4 space-y-6">
            {/* Sector Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Soha</h3>
              <div className="space-y-2">
                {['health', 'education', 'construction', 'procurement', 'traffic', 'property', 'justice', 'tax', 'sport', 'utilities', 'social', 'labor', 'military', 'other'].map((sector) => (
                  <label key={sector} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={filters.sectors.includes(sector)}
                      onChange={() => toggleSector(sector)}
                      className="w-4 h-4 text-primary rounded border-border"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sectorColors[sector] }}
                      />
                      <span className="text-sm">{t(`sector_${sector}`)}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        ({reports.filter(r => normalizeSector(r) === sector).length})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Sana</h3>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm"
              >
                <option value="all">Barchasi</option>
                <option value="today">Bugun</option>
                <option value="week">Bu hafta</option>
                <option value="month">Bu oy</option>
                <option value="3months">3 oy</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Holat</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Barcha' },
                  { value: 'verified', label: 'Tasdiqlangan' },
                  { value: 'reviewing', label: 'Tekshirilmoqda' },
                  { value: 'pending', label: 'Yangi' },
                ].map((status) => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={filters.status === status.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[41.2995, 69.2401]}
            zoom={6}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {filteredReports.map((report) => {
              const lat = report.lat || (report.location && report.location.lat);
              const lng = report.lng || (report.location && report.location.lng);
              const sector = normalizeSector(report);

              return (
                <Marker
                  key={report.id}
                  position={[lat, lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedReport(report),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: sectorColors[sector] || sectorColors.other }}
                        >
                          {t(`sector_${sector}`)}
                        </span>
                        {report.status === 'verified' && (
                          <CheckCircle className="w-3 h-3 text-trust-teal" />
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">{report.location_name || report.location?.address || 'Noma\'lum joy'}</p>
                      <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-card border border-border rounded-lg p-3 shadow-lg hover:bg-muted transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-[1000]">
            <button className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              CSV yuklab olish
            </button>
          </div>

          {/* Report Detail Panel */}
          {selectedReport && (
            <div className="absolute right-4 bottom-4 top-20 z-[1000] w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between bg-card sticky top-0">
                <h3 className="font-medium">Shikoyat Tafsilotlari</h3>
                <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-lg text-sm text-white"
                        style={{ backgroundColor: sectorColors[selectedReport.sector || selectedReport.category || 'other'] || sectorColors.other }}
                      >
                        {t(`sector_${selectedReport.sector || selectedReport.category || 'other'}`)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{selectedReport.location_name || selectedReport.location?.address || 'Noma\'lum joy'}</p>
                          <p className="text-xs text-muted-foreground">{selectedReport.lat || selectedReport.location?.lat}, {selectedReport.lng || selectedReport.location?.lng}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">{new Date(selectedReport.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Tavsif</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedReport.description}
                    </p>
                  </div>

                  {(selectedReport as any).image && (
                    <div className="rounded-lg overflow-hidden border border-border mt-2 bg-muted flex justify-center">
                      <img 
                        src={(selectedReport as any).image} 
                        alt="Report evidence" 
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      ID: CS-2026-0{selectedReport.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
