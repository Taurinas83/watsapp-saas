'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Attendant } from '@/types';
import {
  fetchAttendants, transferConversation,
  getCurrentUserOrganizationId
} from '@/lib/supabase/actions';
import { Loader2, ArrowRightLeft, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TransferModalProps {
  conversationId: string;
  currentAttendantId?: string;
  attendants: Attendant[];
  userId: string;
  onClose: () => void;
  onSuccess: (convId: string, newAttendantId: string) => void;
}

export function TransferModal({ conversationId, currentAttendantId, attendants, userId, onClose, onSuccess }: TransferModalProps) {
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [done, setDone] = useState(false);

  const available = attendants.filter(a => a.id !== currentAttendantId);

  const handleTransfer = async () => {
    if (!selectedId) return;
    setIsTransferring(true);
    const ok = await transferConversation(conversationId, selectedId, userId, reason || undefined, currentAttendantId);
    if (ok) {
      setDone(true);
      setTimeout(() => {
        onSuccess(conversationId, selectedId);
        onClose();
      }, 1200);
    }
    setIsTransferring(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[#171901] text-sm">
            <ArrowRightLeft className="w-4 h-4" style={{ color: '#00E676' }} />
            Transferir Conversa
          </div>
          <button onClick={onClose} className="text-[#4D4D61] hover:text-[#171901]"><X className="w-4 h-4" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00E676, #1DE9B6)' }}>
              <Check className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-bold text-[#171901]">Transferência concluída!</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">Transferir para</label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00E676]"
              >
                <option value="">Selecione um atendente...</option>
                {available.map(a => (
                  <option key={a.id} value={a.id}>{a.name} — {a.department}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">Motivo (opcional)</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Cliente quer falar sobre pagamento..."
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00E676]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4F5F4] text-xs font-bold text-[#4D4D61]">Cancelar</button>
              <button
                onClick={handleTransfer}
                disabled={!selectedId || isTransferring}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#171901] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
              >
                {isTransferring ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
