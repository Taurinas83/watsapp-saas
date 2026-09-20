'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Play,
  LogOut,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import { WhatsAppSimulatorModal } from './WhatsAppSimulatorModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E0E3E1] px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">

        {/* Title Section */}
        <div>
          <h1 className="text-base font-bold text-[#171901] leading-snug tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[#4D4D61]">{subtitle}</p>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* WhatsApp Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
               style={{ background: 'rgba(0,230,118,0.07)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E676' }}></span>
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp Online</span>
          </div>

          {/* Simulator Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[#171901] text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Testar Simulador</span>
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-xl hover:bg-[#F4F5F4] transition-colors relative">
            <Bell className="w-4 h-4 text-[#4D4D61]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#FF8F1A' }}></span>
          </button>

          <div className="h-6 w-px bg-[#E0E3E1]"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F4F5F4] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#171901] font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)', color: 'white' }}
              >
                ZP
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-[#171901] leading-tight">Minha Empresa</p>
                <p className="text-[10px] text-[#4D4D61] font-medium">Administrador</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#4D4D61]" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E0E3E1] py-1 z-50">
                <div className="px-4 py-2 border-b border-[#E0E3E1]">
                  <p className="text-xs font-semibold text-[#171901]">Empresa Ativa</p>
                  <p className="text-xs text-[#4D4D61] truncate">Minha Empresa</p>
                </div>
                <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-xs text-[#4D4D61] hover:bg-[#F4F5F4]">
                  <User className="w-3.5 h-3.5 text-[#4D4D61]" />
                  <span>Perfil & Conta</span>
                </a>
                <a href="/login" className="flex items-center gap-2 px-4 py-2 text-xs border-t border-[#E0E3E1]"
                   style={{ color: '#FF5252' }}
                   onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
                   onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <LogOut className="w-3.5 h-3.5" style={{ color: '#FF5252' }} />
                  <span>Sair da conta</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {isSimulatorOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorOpen(false)} />
      )}
    </>
  );
}
