'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
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
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        {/* Title Section */}
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-snug">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* WhatsApp Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Online</span>
          </div>

          {/* WhatsApp Bot Simulator Trigger Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow duration-150 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Testar Atendente (Simulador)</span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                TS
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">Tiago Taurian</p>
                <p className="text-[10px] text-slate-500 font-medium">Administrador</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in-50 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Empresa Ativa</p>
                  <p className="text-xs text-slate-500 truncate">Minha Empresa</p>
                </div>
                <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Perfil & Conta</span>
                </a>
                <a href="/login" className="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100">
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sair da conta</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WhatsApp Simulator Drawer Modal */}
      {isSimulatorOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorOpen(false)} />
      )}
    </>
  );
}
