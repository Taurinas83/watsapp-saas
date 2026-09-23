'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  QrCode,
  Bot,
  Calendar,
  Users,
  Kanban,
  CalendarClock,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

import { FaqItem, FAQ_DATA, FAQ_CATEGORIES } from '@/lib/faq-data';

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('wa-1');

  const categories = [
    { id: 'all', label: 'Todas as Dúvidas' },
    { id: 'whatsapp', label: '📱 Conexão WhatsApp' },
    { id: 'bot', label: '🤖 Robô & IA' },
    { id: 'agenda', label: '📅 Agendas & Grupos' },
    { id: 'crm', label: '🎯 Funil CRM' },
    { id: 'broadcast', label: '⏰ Mensagens Agendadas' },
    { id: 'billing', label: '💳 Planos & Faturas' },
  ];

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        (item.steps && item.steps.some((s) => s.toLowerCase().includes(term))) ||
        (item.tip && item.tip.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <Header
        title="Central de Ajuda & Tutoriais Rápidos"
        subtitle="Guias didáticos passo a passo para você dominar todos os recursos do Zapella"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Top Hero / Search Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Base de Conhecimento Oficial
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Como podemos te ajudar hoje?</h2>
            <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
              Tire dúvidas instantâneas sobre conexão do WhatsApp, treinamento do robô, agendamentos, funil CRM e mensagens agendadas.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua dúvida (ex: como conectar, agenda, grupos, transbordo)..."
              className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none shadow-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#128C7E] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#128C7E]/40 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaq.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Nenhum resultado encontrado para &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs text-slate-400">Tente buscar por outras palavras-chave ou navegue pelas categorias acima.</p>
            </div>
          ) : (
            filteredFaq.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#128C7E]/50 shadow-sm ring-1 ring-[#128C7E]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                          isExpanded ? 'bg-[#128C7E] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ?
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E]">
                          {item.categoryLabel}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.question}</h3>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs text-slate-700 leading-relaxed animate-in fade-in-50">
                      <p>{item.answer}</p>

                      {/* Step-by-step guidance */}
                      {item.steps && item.steps.length > 0 && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                            Passo a Passo:
                          </span>
                          <ol className="space-y-2">
                            {item.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                                <span className="w-5 h-5 rounded-full bg-[#128C7E]/10 text-[#128C7E] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Gold Tip Callout */}
                      {item.tip && (
                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-2.5 text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5 text-amber-950">Dica de Ouro:</span>
                            <span>{item.tip}</span>
                          </div>
                        </div>
                      )}

                      {/* Direct Action Link */}
                      {item.actionLink && (
                        <div className="pt-2 flex items-center justify-end">
                          <Link
                            href={item.actionLink.href}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                          >
                            <span>{item.actionLink.label}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-[#128C7E] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Ainda precisa de ajuda especializada?</h4>
              <p className="text-xs text-slate-500">
                Nossa equipe de suporte está pronta para te auxiliar com qualquer configuração específica.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20com%20minha%20conta%20no%20Zapella."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar com Suporte</span>
          </a>
        </div>
      </div>
    </div>
  );
}
