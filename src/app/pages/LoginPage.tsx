import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, MessageSquare, User, Phone } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loginWithPassword, setPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [phone, setPhone] = useState('+998');
  const [name, setName] = useState('');
  const [password, setPasswordState] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // 1. Ro'yxatdan o'tish (Signup) - Kod yuborish
  const handleSignupRequest = async () => {
    if (phone.length < 12 || name.length < 3 || password.length < 4) {
      return alert('Iltimos, barcha maydonlarni to\'liq to\'ldiring');
    }
    setLoading(true);
    try {
      const result = await sendOtp(phone);
      setOtpCode(result.code);
      setStep(2); // OTP kiritish bosqichiga o'tamiz
    } catch (error) {
      alert('Xatolik: Server bilan bog\'lanishda muammo');
    } finally {
      setLoading(false);
    }
  };

  // 2. Ro'yxatdan o'tishni yakunlash (Verify OTP + Set Pass)
  const handleVerifyAndSignup = async () => {
    setLoading(true);
    try {
      const result = await verifyOtp(phone, otp);
      if (result.success) {
        // Kod to'g'ri, endi parolni saqlaymiz
        const passResult = await setPassword(phone, password, name);
        if (passResult) {
          navigate('/map');
        }
      } else {
        alert('Tasdiqlash kodi xato');
      }
    } catch (error: any) {
      alert(`Xatolik: ${error.message || 'Server bilan aloqa uzildi'}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Kirish (Login)
  const handleLogin = async () => {
    if (phone.length < 12 || password.length < 4) {
      return alert('Telefon va parolni kiriting');
    }
    setLoading(true);
    try {
      const success = await loginWithPassword(phone, password);
      if (success) {
        navigate('/map');
      } else {
        alert('Telefon raqami yoki parol xato');
      }
    } catch (error: any) {
      alert(`Xatolik: ${error.message || 'Server bilan aloqa uzildi'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-serif)' }}>
            CorruptStop
          </h1>
          <p className="text-slate-500 text-sm mt-1">Xavfsiz va anonim anti-korrupsiya platformasi</p>
        </div>

        {/* Tabs */}
        {step === 1 && (
          <div className="flex px-8 border-b border-slate-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'
              }`}
            >
              KIRISH
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'
              }`}
            >
              RO'YXATDAN O'TISH
            </button>
          </div>
        )}

        <div className="p-8">
          {step === 1 ? (
            activeTab === 'login' ? (
              /* LOGIN TAB */
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Telefon raqami</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Parol</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPasswordState(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {loading ? 'Kirilmoqda...' : 'TIZIMGA KIRISH'}
                </button>
              </div>
            ) : (
              /* SIGNUP TAB */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Foydalanuvchi ismi</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Telefon raqami</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Parol o'rnating</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPasswordState(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSignupRequest}
                  disabled={loading}
                  className="w-full py-4 bg-[#1D9E75] text-white rounded-2xl font-bold shadow-lg shadow-green-600/20 hover:opacity-90 transition-all"
                >
                  RO'YXATDAN O'TISH
                </button>
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Kodni olish uchun</p>
                  <a href="https://t.me/corruptstop_sms_bot" target="_blank" className="text-primary text-xs font-bold hover:underline">
                    @corruptstop_sms_bot
                  </a>
                </div>
              </div>
            )
          ) : (
            /* OTP STEP */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4">
                  <MessageSquare className="w-4 h-4" />
                  KOD TELEGRAMGA YUBORILDI
                </div>
                <p className="text-sm text-slate-500">
                  Botga o'tib, 6 xonali tasdiqlash kodini oling:
                </p>
                <a 
                  href={`https://t.me/corruptstop_sms_bot?start=code_${otpCode}`}
                  target="_blank"
                  className="block mt-4 text-primary font-bold hover:underline"
                >
                  @corruptstop_sms_bot (Kodni ko'rish)
                </a>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-3xl font-black tracking-[0.5em] outline-none"
              />
              <button
                onClick={handleVerifyAndSignup}
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold"
              >
                TASDIQLASH
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-400 text-xs hover:underline">
                Orqaga qaytish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
