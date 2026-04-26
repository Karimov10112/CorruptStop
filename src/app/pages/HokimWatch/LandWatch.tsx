import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, AlertTriangle, Info, Search, Filter, ThumbsUp, FileDown, FileText } from 'lucide-react';
import { Link } from 'react-router';

// Custom Icons
const landIcon = (color: string) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 6px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});
const citizenIcon = (color: string) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
const API = `http://localhost:3001`;

export function LandWatch() {
  const [landData, setLandData] = useState<any[]>([]);
  const [citizenReports, setCitizenReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/hw/land`).then(res => res.json()),
      fetch(`${API}/api/reports`).then(res => res.json())
    ]).then(([land, reports]) => {
      setLandData(land);
      setCitizenReports(reports);
      setLoading(false);
    });
  }, []);

  const handleVote = async (id: string) => {
    const isUnvoting = voted.has(id);
    const res = await fetch(`${API}/api/hw/land/${id}/vote`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: isUnvoting ? 'unvote' : 'vote' })
    });
    const result = await res.json();
    if (result.success) {
      setLandData(prev => prev.map(item => item.id === id ? { ...item, votes: result.votes } : item));
      setVoted(prev => {
        const newSet = new Set(prev);
        if (isUnvoting) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  };

  const handleComment = async (id: string) => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${API}/api/hw/projects/${id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: commentText,
          author: 'Anonim'
        })
      });
      if (res.ok) {
        // Refresh data to show new comment
        const updatedRes = await fetch(`${API}/api/hw/land`);
        const updatedData = await updatedRes.json();
        setLandData(updatedData);
        setCommentText('');
        setActiveCommentId(null);
        alert('Fikringiz anonim tarzda qabul qilindi!');
      }
    } catch (e) {
      alert('Xatolik yuz berdi');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePDF = (id: string) => {
    window.open(`${API}/api/hw/land/${id}/pdf`, '_blank');
  };

  const filteredLand = landData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Control Panel */}
        <div className="w-full lg:w-[450px] bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
          <div className="p-6 bg-slate-900 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HokimWatch: LandWatch</h1>
                <p className="text-xs text-slate-400">Yer resurslari shaffofligi monitori</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hudud yoki muammoni qidiring..."
                className="w-full bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dolzarb Holatlar ({filteredLand.length})</span>
              <button className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>
            ) : (
              filteredLand.map(item => (
                <div key={item.id} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  item.status === 'critical' ? 'border-red-100 bg-red-50/30' : 'border-amber-100 bg-amber-50/30'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                      item.status === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {item.legal_status}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <AlertTriangle className={`w-3 h-3 ${item.risk_score > 90 ? 'text-red-500' : 'text-amber-500'}`} />
                      Risk: {item.risk_score}%
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(item.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          voted.has(item.id)
                            ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-red-500 hover:border-red-500'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'
                        }`}
                        title={voted.has(item.id) ? "Ovozni bekor qilish" : "Tasdiqlash"}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {voted.has(item.id) ? `✓ Tasdiqladi (${item.votes})` : `Bu haqiqat (${item.votes || 0})`}
                      </button>
                      <button
                        onClick={() => handlePDF(item.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-[10px] font-bold hover:bg-slate-100 transition-all border border-slate-200"
                      >
                        <FileDown className="w-3 h-3" />
                        PDF Ariza
                      </button>
                    </div>
                    <button 
                      onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)}
                      className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all"
                    >
                      Fikr bildirish
                    </button>
                  </div>

                  {activeCommentId === item.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ushbu hudud haqida nimalarni bilasiz? (Anonim)..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none h-20"
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button 
                          onClick={() => setActiveCommentId(null)}
                          className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          Bekor qilish
                        </button>
                        <button 
                          disabled={submittingComment}
                          onClick={() => handleComment(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {submittingComment ? 'Yuborilmoqda...' : 'Yuborish'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comments List Preview */}
                  {item.reports && item.reports.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase">So'nggi fikrlar:</p>
                      {item.reports.slice(-2).reverse().map((r: any) => (
                        <div key={r.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-[10px] text-slate-600 italic">"{r.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Info className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 leading-tight">
                <b>Eslatma:</b> LandWatch tizimi sun'iy intellekt va jamoatchilik nazorati asosida ishlaydi. Agar sizda noqonuniy yer sotilishi haqida ma'lumot bo'lsa, anonim tarzda xabar bering.
              </p>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-200 h-[400px] lg:h-auto">
          <MapContainer center={[41.3115, 69.2815]} zoom={11} className="h-full w-full z-0">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredLand.map(item => (
              <Marker 
                key={item.id} 
                position={[item.lat, item.lng]}
                icon={landIcon(item.status === 'critical' ? '#EF4444' : '#F59E0B')}
              >
                <Popup>
                  <div className="p-2 w-64">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-black uppercase text-slate-400">LandWatch Audit</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-3">{item.legal_status}</p>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                       <p className="text-[10px] text-slate-600 italic">"{item.description}"</p>
                       <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                         <span className="text-[9px] text-slate-400 font-bold uppercase">Jamoat nazorati</span>
                         <span className="text-[10px] font-black text-emerald-600">👍 42 kishi tasdiqladi</span>
                       </div>
                    </div>
                    <button className="w-full py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20">
                      Tahlilni ko'rish
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {citizenReports.map(report => (
              <Marker 
                key={report.id} 
                position={[report.lat || 41.2995, report.lng || 69.2401]}
                icon={citizenIcon('#3B82F6')}
              >
                <Popup>
                  <div className="p-2 w-64">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-black uppercase text-slate-400">Fuqaro Shikoyati</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{report.sector || 'Umumiy'}</h4>
                    <p className="text-xs text-slate-500 mb-3">{report.date}</p>
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 mb-3">
                       <p className="text-[10px] text-blue-600 italic">"{report.description}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Status:</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase">{report.status || 'Kutilmoqda'}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Overlay Stats */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xl z-[1000] hidden md:block">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Toshkent Land-Audit</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-8">
                <span className="text-xs text-slate-600">Umumiy yer xavfi</span>
                <span className="text-xs font-bold text-red-500">YUQORI</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[78%]"></div>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-xs text-slate-600">Noqonuniy qurilishlar</span>
                <span className="text-xs font-bold text-slate-800">12 ta nuqta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
