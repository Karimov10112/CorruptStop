import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { ExternalLink, Send, Paperclip, Mic, MapPin } from 'lucide-react';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  buttons?: string[][];
  isInfo?: boolean;
}

export function TelegramBotPage() {
  const { addReport } = useReports();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'bot',
      text: '🛡 Assalomu alaykum!\n\nMen CorruptStop — anonimlik kafolatlangan korrupsiyaga qarshi platforma.',
      buttons: [
        ['📝 Shikoyat berish', '🗺 Xaritani ko\'rish'],
        ['ℹ️ Yordam']
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAction = (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // Bot logic
    setTimeout(() => {
      processBotStep(text);
    }, 600);
  };

  const processBotStep = (userText: string) => {
    let botMsg: Message = { id: (Date.now() + 1).toString(), from: 'bot', text: '' };

    if (step === 0) {
      if (userText === '📝 Shikoyat berish') {
        botMsg.text = 'Qaysi sohada muammo kuzatdingiz?';
        botMsg.buttons = [
          ['🏥 Sog\'liqni saqlash', '📚 Ta\'lim', '🏗 Qurilish'],
          ['🛒 Davlat xaridlari', '📦 Boshqa']
        ];
        setStep(1);
      } else {
        botMsg.text = 'Iltimos, quyidagi tugmalardan birini tanlang.';
        botMsg.buttons = [['📝 Shikoyat berish', '🗺 Xaritani ko\'rish']];
      }
    } else if (step === 1) {
      botMsg.text = 'Hodisa qayerda bo\'ldi?\n\n📍 Joylashuvingizni ulashishingiz yoki manzilni yozishingiz mumkin.';
      botMsg.buttons = [['📍 Joylashuvni ulashish'], ['✍️ Manzilni yozish']];
      setStep(2);
    } else if (step === 2) {
      botMsg.text = 'Nima bo\'lganini qisqacha yozing. (Masalan: Shifoxona bosh shifokori pul talab qildi...)';
      setStep(3);
    } else if (step === 3) {
      botMsg.text = '✅ Shikoyatingizni tekshirib ko\'ring:\n\n━━━━━━━━━━━━━━━━━━\nSoha: 🏥 Tanlangan soha\nJoylashuv: Toshkent\nTavsif: "' + userText + '"\n━━━━━━━━━━━━━━━━━━';
      botMsg.buttons = [['✅ Yuborish', '✏️ Tahrirlash']];
      setStep(4);
    } else if (step === 4) {
      if (userText === '✅ Yuborish') {
        // ACTUAL INTEGRATION: Add to real reports context!
        addReport({
          lat: 41.2995 + (Math.random() - 0.5) * 0.05,
          lng: 69.2401 + (Math.random() - 0.5) * 0.05,
          sector: 'health',
          location: 'Telegram Bot (Toshkent)',
          description: 'Telegram bot orqali yuborilgan shikoyat.',
        });

        botMsg.text = '🎉 Shikoyatingiz qabul qilindi!\n\nID: CS-2026-' + Math.floor(10000 + Math.random() * 90000) + '\n\nSizga +10 ball berildi! ⭐️';
        botMsg.buttons = [['🗺 Xaritada ko\'rish', '📝 Yangi shikoyat']];
        setStep(0);
      } else {
        botMsg.text = 'Qayta urinib ko\'ring.';
        botMsg.buttons = [['📝 Shikoyat berish']];
        setStep(0);
      }
    }

    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div>
            <h1 className="text-5xl mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              Telegram Bot <span className="text-primary">Simulyatori</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Bu interaktiv simulyator orqali bot qanday ishlashini hozirni o'zida sinab ko'rishingiz mumkin. 
              Yuborilgan shikoyatlar **haqiqiy xaritaga** ulanadi.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
                <div className="text-2xl">⚡</div>
                <div>
                  <h3 className="font-medium">Tezkor</h3>
                  <p className="text-sm text-muted-foreground">Shikoyat yuborish 1 daqiqadan kam vaqt oladi.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-medium">To'liq Anonim</h3>
                  <p className="text-sm text-muted-foreground">Sizning shaxsingiz maxfiy qoladi.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="https://t.me/corruptstop_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#229ED9] text-white rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                Haqiqiy botni ochish
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Interactive Mockup */}
          <div className="relative mx-auto w-full max-w-[320px]">
            {/* Phone Frame */}
            <div className="relative bg-[#1D1D1B] rounded-[3rem] p-3 shadow-2xl border-4 border-muted">
              {/* Screen */}
              <div className="relative bg-[#0d1117] rounded-[2.5rem] overflow-hidden flex flex-col h-[600px]">
                {/* Status Bar */}
                <div className="h-6 flex items-center justify-between px-6 pt-2 text-[10px] text-white/60">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-2 border border-white/40 rounded-sm"></div>
                  </div>
                </div>

                {/* Bot Header */}
                <div className="h-14 bg-[#1c1c1e] border-b border-white/5 flex items-center gap-3 px-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-lg shadow-inner">
                    🛡
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">CorruptStop Bot</div>
                    <div className="text-[10px] text-trust-teal">online</div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            msg.from === 'user'
                              ? 'bg-[#2b5278] text-white rounded-tr-none'
                              : 'bg-[#212121] text-white rounded-tl-none border border-white/5'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                      </div>
                      {msg.buttons && (
                        <div className="grid grid-cols-2 gap-1 px-4">
                          {msg.buttons.flat().map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              onClick={() => handleAction(btn)}
                              className="bg-[#212121] hover:bg-[#2c2c2c] border border-white/10 rounded-lg py-2 text-[11px] text-white transition-colors"
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="h-14 bg-[#1c1c1e] border-t border-white/5 flex items-center gap-2 px-3">
                  <Paperclip className="w-5 h-5 text-white/40" />
                  <div className="flex-1 bg-white/5 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Xabar..."
                      className="bg-transparent border-none outline-none text-white text-sm w-full"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && inputValue && (handleAction(inputValue), setInputValue(''))}
                    />
                  </div>
                  {inputValue ? (
                    <button onClick={() => (handleAction(inputValue), setInputValue(''))}>
                      <Send className="w-5 h-5 text-primary" />
                    </button>
                  ) : (
                    <Mic className="w-5 h-5 text-white/40" />
                  )}
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1D1D1B] rounded-b-2xl z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

