import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Header } from '../../components/Header';
import { ArrowLeft, CheckCircle, Clock, MapPin, Building2, AlertTriangle, Satellite, Database, Brain } from 'lucide-react';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/hw/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;
  if (!project) return <div className="p-8 text-center">Loyiha topilmadi</div>;

  const progress = Math.round((project.budget_spent / project.budget_amount) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link to="/hokimwatch" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Barcha loyihalarga qaytish
        </Link>

        {/* Header qismi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {project.status}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{project.title}</h1>
                <p className="text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {project.address}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium mb-1">AJRATILGAN BYUDJET</p>
                <p className="text-2xl font-black text-primary font-mono">
                  {(project.budget_amount / 1000000).toLocaleString()} mln
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed max-w-3xl mb-8">
              {project.description}
            </p>

            {/* Progress va Pudratchi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Moliya o'zlashtirilishi</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">
                  Sarflangan: {(project.budget_spent / 1000000).toLocaleString()} mln
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-500 w-24">Pudratchi:</span>
                  <span className="font-bold text-slate-900">{project.contractor}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-500 w-24">Muddat:</span>
                  <span className="font-bold text-slate-900">{project.start_date} &mdash; {project.end_date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rasmlar va Harakat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold mb-4">Oldin va Keyin</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase text-center">Boshlanishidan oldin</p>
                  <img src={project.before_photos?.[0] || 'https://via.placeholder.com/400x300?text=Rasm+Yo%27q'} alt="Before" className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase text-center">Joriy holat (Fuqaro rasmi)</p>
                  {project.reports && project.reports[0] && project.reports[0].after_photos ? (
                    <img src={project.reports[0].after_photos[0]} alt="After" className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 border-dashed flex items-center justify-center text-sm text-slate-400">
                      Hali rasm yuklanmagan
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fuqaro hisobotlari ro'yxati */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold mb-4">Jamoatchilik nazorati natijalari</h2>
              {project.reports && project.reports.length > 0 ? (
                <div className="space-y-4">
                  {project.reports.map((report: any) => (
                    <div key={report.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-lg">{'★'.repeat(Math.round(report.score_overall))}</span>
                        <span className="text-xs text-slate-400 ml-auto">{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 italic mb-3">"{report.visible_defects}"</p>
                      
                      {report.ai_analysis && (
                        <div className={`p-3 rounded-lg border text-xs ${report.ai_analysis.status === 'valid' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                            <Brain className="w-4 h-4 text-primary" />
                            AI EKSPERT TAHLILI
                          </div>
                          <p className="text-slate-600 mb-2">{report.ai_analysis.analysis}</p>
                          <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Huquqiy asos:</div>
                          <p className="text-slate-700 font-medium">{report.ai_analysis.legal_basis}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Hozircha hisobotlar yo'q.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">Sifatni tekshirdingizmi?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Agar siz ushbu loyiha yonida bo'lsangiz, joriy holatni rasmga olib, uning sifatini baholang.
              </p>
              <Link to={`/hokimwatch/${project.id}/report`} className="block w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                Hisobot Yuborish
              </Link>
            </div>

            {/* Sentinel-2 Satellite Mock */}
            <div className="bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 p-6 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800")', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
              <div className="relative z-10">
                <h3 className="font-bold flex items-center gap-2 mb-2 text-blue-300"><Satellite className="w-5 h-5" /> Sentinel-2 Sun'iy Yo'ldoshi</h3>
                <p className="text-xs text-slate-400 mb-4 font-mono">So'nggi kadr: 24 soat oldin</p>
                <div className="bg-black/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-md">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">Kosmik AI Tahlili:</span>
                    <span className="text-amber-400 font-bold">30% qurilgan</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Audit Trail */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800"><Database className="w-5 h-5 text-emerald-500" /> Blockchain Audit Trail</h3>
                <Link to="/hokimwatch/explorer" className="text-[10px] text-emerald-600 hover:underline font-bold uppercase tracking-wider">Explorerda ko'rish</Link>
              </div>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {project.reports && project.reports.map((report: any, idx: number) => (
                  <div key={'hash-'+idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900 text-xs">Yangi Hisobot Yuklandi</div>
                        <time className="font-mono text-[10px] text-emerald-600">{new Date(report.created_at).toLocaleTimeString()}</time>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono break-all bg-slate-200/50 p-1 rounded border border-slate-200">
                        HASH: {report.id.substring(0, 8)}...e9a4b2c1
                      </div>
                    </div>
                  </div>
                ))}

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-100 bg-slate-50 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900 text-xs">API dan yuklandi</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono break-all bg-slate-200/50 p-1 rounded border border-slate-200">
                      HASH: 0x8f3c...b1a2
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
