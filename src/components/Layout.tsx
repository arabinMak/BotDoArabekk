import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, ChefHat, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Início' },
    { path: '/receitas', icon: BookOpen, label: 'Receitas' },
    { path: '/cardapio', icon: ChefHat, label: 'Cardápio' },
    { path: '/configuracoes', icon: Settings, label: 'Conta' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#F5E6FF] to-[#FFF0F5]">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] rounded-full flex items-center justify-center">
                <span className="text-[#8B7355] font-bold text-lg">CL</span>
              </div>
              <span className="text-xl font-bold text-[#8B7355] hidden sm:block">
                Corpo Leve
              </span>
            </Link>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] font-semibold'
                        : 'text-[#A68A7A] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#A68A7A]">
          Sistema Corpo Leve - Sua jornada de bem-estar
        </div>
      </footer>
    </div>
  );
}
