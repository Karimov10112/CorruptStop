import { Outlet } from 'react-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ReportProvider } from '../contexts/ReportContext';

export function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ReportProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Outlet />
            </div>
          </ReportProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
