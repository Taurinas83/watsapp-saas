'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialKnowledgeItems } from '@/lib/mock-data';
import { KnowledgeItem, KnowledgeCategory } from '@/types';
import { searchKnowledgeBase } from '@/lib/ai-engine';
import { fetchKnowledgeItems, createKnowledgeItem, deleteKnowledgeItem, getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit,
  Tag,
  Sparkles,
  HelpCircle,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(initialKnowledgeItems);
  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('faq');
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');

  // AI Match Tester State
  const [testQuery, setTestQuery] = useState('');
  const [matchedResults, setMatchedResults] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    async function load() {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);
      const data = await fetchKnowledgeItems(currentOrgId);
      if (data && data.length > 0) {
        setItems(data);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    const newItem = await createKnowledgeItem(orgId, formCategory, formQuestion, formAnswer);
    if (newItem) {
      setItems(prev => [newItem, ...prev]);
    } else {
      const fallback: KnowledgeItem = {
        id: `k-${Date.now()}`,
        organization_id: orgId,
        category: formCategory,
        question: formQuestion,
        answer: formAnswer,
        created_at: new Date().toISOString()
      };
      setItems(prev => [fallback, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este item da Base de Conhecimento?')) return;
    await deleteKnowledgeItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };


  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'Todas as Categorias', icon: BookOpen },
    { id: 'faq', label: 'Perguntas Frequentes (FAQ)', icon: HelpCircle },
    { id: 'product', label: 'Produtos & Serviços', icon: ShoppingBag },
    { id: 'pricing', label: 'Preços & Promoções', icon: DollarSign },
    { id: 'hours', label: 'Horários & Endereço', icon: Clock },
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory('faq');
    setFormQuestion('');
    setFormAnswer('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormQuestion(item.question);
    setFormAnswer(item.answer);
    setIsModalOpen(true);
  };


  const handleRunAiTest = () => {
    if (!testQuery.trim()) {
      setMatchedResults([]);
      return;
    }
    const results = searchKnowledgeBase(testQuery, items);
    setMatchedResults(results);
  };

  return (
    <div>
      <Header
        title="Base de Conhecimento (RAG)"
        subtitle="Cadastre perguntas, respostas, preços e informações que a IA utilizará para atender"
      />

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Action Header & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palavra-chave na base..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Item</span>
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Match Tester Widget */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-5 rounded-2xl text-white border border-emerald-800/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Simulador de Recuperação RAG</h4>
            </div>
            <span className="text-[10px] text-emerald-300/80">Teste a busca da IA em tempo real</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiTest()}
              placeholder="Digite uma pergunta para testar a IA (Ex: Qual o horário de atendimento?)"
              className="flex-1 bg-slate-950/80 border border-emerald-700/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={handleRunAiTest}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
            >
              Testar Busca
            </button>
          </div>

          {matchedResults.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-800/40 space-y-2">
              <p className="text-[11px] font-semibold text-emerald-300">Itens encontrados que serão incluídos no contexto do Claude:</p>
              {matchedResults.map(r => (
                <div key={r.id} className="bg-slate-950/90 p-3 rounded-lg border border-emerald-500/30 text-xs">
                  <p className="font-semibold text-white">Q: {r.question}</p>
                  <p className="text-slate-300 mt-0.5 text-[11px]">R: {r.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.length === 0 ? (
            <div className="md:col-span-2 bg-white p-12 text-center rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhum item encontrado nesta categoria</p>
              <p className="text-xs text-slate-400 mt-1">Cadastre novas perguntas e respostas para treinar a IA do seu atendente.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.question}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                    {item.answer}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>ID: {item.id}</span>
                  <span>Cadastrado em {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Add / Edit Knowledge Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingItem ? 'Editar Informação da Base' : 'Adicionar Nova Informação'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Categoria da Informação</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as KnowledgeCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="faq">Perguntas Frequentes (FAQ)</option>
                  <option value="product">Produtos & Serviços</option>
                  <option value="pricing">Preços & Promoções</option>
                  <option value="hours">Horários & Endereço</option>
                  <option value="general">Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pergunta ou Tópico de Dúvida</label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Ex: Quais são os meios de pagamento aceitos?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resposta Oficial (Que a IA utilizará)</label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Escreva a resposta precisa com preços, horários ou informações detalhadas..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                >
                  Salvar Informação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
