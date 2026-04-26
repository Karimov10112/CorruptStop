import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertCircle, FileText, BarChart3, Map as MapIcon, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';

// Xarita iconkasini sozlash
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon yaratish (yashil, sariq, qizil)
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing': return '#F59E0B'; // Sariq
    case 'completed': return '#10B981'; // Yashil
    case 'delayed': return '#EF4444'; // Qizil
    case 'cancelled': return '#6B7280'; // Kulrang
    default: return '#3B82F6'; // Ko'k
  }
};

export function HokimWatchMap() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/hw/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  };

  const handleSync = () => {
    setSyncing(true);
    fetch('http://localhost:3001/api/hw/sync', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchProjects();
        }
      })
      .finally(() => {
        setSyncing(false);
      });
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 border-r border-border bg-card overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-border bg-muted/20">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              HokimWatch
            </h1>
            <p className="text-sm text-muted-foreground">
              Davlat byudjetidan moliyalashtirilayotgan loyihalar ustidan jamoatchilik nazorati.
            </p>
          </div>

          <div className="p-4 border-b border-border grid grid-cols-2 gap-2">
            <Link to="/hokimwatch/stats" className="flex items-center justify-center gap-2 py-3 bg-muted rounded-xl hover:bg-slate-200 transition-colors text-xs font-medium">
              <BarChart3 className="w-4 h-4" />
              Statistika
            </Link>
            <Link to="/hokimwatch/land" className="flex items-center justify-center gap-2 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors text-xs font-bold border border-emerald-200">
              <MapIcon className="w-4 h-4" />
              Yer Nazorati
            </Link>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={`w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md ${
                syncing 
                  ? 'bg-blue-100 text-blue-600 border-blue-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 hover:shadow-blue-500/40'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Davlat API lariga ulanmoqda...' : '🔄 Davlat Portallaridan Yangilash'}
            </button>
            <h3 className="font-bold text-lg mb-4">Loyihalar Ro'yxati ({projects.length})</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse bg-muted h-32 rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="p-4 bg-background border border-border rounded-xl shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded uppercase text-slate-500">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: getStatusColor(project.status) }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(project.status) }}></div>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm mb-2 line-clamp-2">{project.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-primary">{(project.budget_amount / 1000000).toLocaleString()} mln so'm</span>
                      <Link to={`/hokimwatch/${project.id}`} className="text-blue-500 hover:underline font-medium">Batafsil &rarr;</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Xarita */}
        <div className="flex-1 bg-slate-100 relative">
          <MapContainer center={[41.2995, 69.2401]} zoom={6} className="h-full w-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {projects.map(project => (
              <Marker 
                key={project.id} 
                position={[project.lat, project.lng]}
                icon={createIcon(getStatusColor(project.status))}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm mb-1">{project.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">{project.district}</p>
                    <Link to={`/hokimwatch/${project.id}`} className="block w-full text-center py-2 bg-primary text-white text-xs font-bold rounded">
                      Ko'rish
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
