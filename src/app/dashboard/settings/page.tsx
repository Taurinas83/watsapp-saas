'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Settings, Clock, Bell, Save, Check, Shield, Mail, Smartphone } from 'lucide-react';

export default function GeneralSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Business Hours State
  const [schedule, setSchedule] = useState([
    { day: 'Segunda-feira', active: true, open: '08:00', close: '19:00' },
    { day: 'Terça-feira', active: true, open: '08:00', close: '19:00' },
    { day: 'Quarta-feira', active: true, open: '08:00', close: '19:00' },
    { day: 'Quinta-feira', active: true, open: '08:00', close: '19:00' },
    { day: 'Sexta-feira', active: true, open: '08:00', close: '19:00' },
    { day: 'Sábado', active: true, open: '08:00', close: '13:00' },
    { day: 'Domingo', active: false, open: '08:00', close: '12:00' },
  ]);

  const [outOfHoursMsg, setOutOfHoursMsg] = useState(
    'Olá! No momento estamos fora do nosso horário de atendimento. Deixe sua dúvida que responderemos assim que abrirmos! 😊'
  );

  const [notifyHandoverEmail, setNotifyHandoverEmail] = useState(true);
  const [notifyHandoverWhatsApp, setNotifyHandoverWhatsApp] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <Header
        title="Configurações Gerais"
        subtitle="Ajuste horários de atendimento, mensagens de ausência e alertas de notificação"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* Operating Hours Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Horário de Funcionamento Comercial</span>
            </div>

            <p className="text-xs text-slate-500">
              Fora destes horários, o atendente virtual enviará automaticamente a mensagem de ausência configurada abaixo.
            </p>

            <div className="space-y-3 pt-2">
              {schedule.map((item, idx) => (
                <div key={item.day} className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[idx].active = e.target.checked;
                        setSchedule(updated);
                      }}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-800 min-w-[120px]">{item.day}</span>
                  </div>

                  {item.active ? (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>Abre às</span>
                      <input
                        type="time"
                        value={item.open}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[idx].open = e.target.value;
                          setSchedule(updated);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                      <span>Fecha às</span>
                      <input
                        type="time"
                        value={item.close}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[idx].close = e.target.value;
                          setSchedule(updated);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Fechado o dia todo</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Mensagem de Fora do Horário</label>
              <textarea
                rows={3}
                value={outOfHoursMsg}
                onChange={(e) => setOutOfHoursMsg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Notificações de Transferência (Handover)</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Notificação por E-mail</p>
                    <p className="text-[11px] text-slate-500">Enviar e-mail para a equipe quando a IA solicitar atendimento humano.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHandoverEmail}
                  onChange={(e) => setNotifyHandoverEmail(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Alerta Sonoro no Painel da Equipe</p>
                    <p className="text-[11px] text-slate-500">Emitir bip sonoro no Inbox quando uma nova conversa precisar de intervenção.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHandoverWhatsApp}
                  onChange={(e) => setNotifyHandoverWhatsApp(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações Gerais</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
