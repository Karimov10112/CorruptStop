import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Report {
  id: string | number;
  lat: number;
  lng: number;
  sector: string;
  location: string;
  description: string;
  date: string;
  status: 'pending' | 'reviewing' | 'verified' | 'rejected';
  amount?: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'status' | 'date'>) => void;
  updateReportStatus: (id: string | number, status: Report['status']) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const initialReports: Report[] = [
  { id: 1, lat: 41.2995, lng: 69.2401, sector: 'health', location: 'Toshkent, Yunusobod', description: 'Shifoxona bosh shifokori...', date: '2026-04-24', status: 'verified' },
  { id: 2, lat: 41.3111, lng: 69.2797, sector: 'education', location: 'Toshkent, Mirobod', description: 'Maktab direktori...', date: '2026-04-23', status: 'pending' },
  { id: 3, lat: 39.6542, lng: 66.9597, sector: 'construction', location: 'Samarqand', description: 'Qurilish ruxsati...', date: '2026-04-22', status: 'verified' },
  { id: 4, lat: 40.7696, lng: 72.3469, sector: 'procurement', location: 'Qo\'qon', description: 'Davlat xaridi...', date: '2026-04-21', status: 'reviewing' },
  { id: 5, lat: 41.5606, lng: 60.6175, sector: 'utilities', location: 'Urganch', description: 'Kommunal xizmat...', date: '2026-04-20', status: 'verified' },
];

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const API_URL = 'http://localhost:3001/api/reports';

  // Serverdan ma'lumotlarni yuklash
  const fetchReports = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('API Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchReports();
    // Har 5 soniyada yangi ma'lumotlarni tekshirish (Polling)
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const addReport = async (newReport: Omit<Report, 'id' | 'status' | 'date'>) => {
    try {
      console.log('Sending report...', newReport);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      if (response.ok) {
        const savedReport = await response.json();
        setReports(prev => [savedReport, ...prev]);
        console.log('Report saved ✅');
      } else {
        alert("Xatolik: Server shikoyatni qabul qilmadi.");
      }
    } catch (error) {
      console.error('API Post error:', error);
      alert("Xatolik: Server bilan bog'lanib bo'lmadi. Server yoniqmi?");
    }
  };

  const updateReportStatus = (id: string | number, status: Report['status']) => {
    // Demo uchun faqat local state yangilanadi
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReportStatus }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within ReportProvider');
  }
  return context;
}
