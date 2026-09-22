'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { WhatsAppStatus } from '@/types';
import { QrCode, Smartphone, Wifi, WifiOff, RefreshCw, LogOut, CheckCircle2, ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';

export default function WhatsAppConnectionPage() {
  const [status, setStatus] = useState<WhatsAppStatus>('disconnected');
  const [phone, setPhone] = useState<string>('');
  const [profileName, setProfileName] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [qrCodeImg, setQrCodeImg] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch('/api/whatsapp/instance');
      const data = await res.json();
      if (data.status === 'connected') {
        setStatus('connected');
        setPhone(data.phone || 'WhatsApp Conectado');
        setProfileName(data.profileName || '');
        setProfilePicUrl(data.profilePicUrl || null);
      } else {
        setStatus('disconnected');
        setProfilePicUrl(null);
        if (data.serverOffline) {
          setErrorMessage('Servidor de conexão offline no momento. Por favor, certifique-se de que o contêiner Evolution API está rodando.');
        }
      }
    } catch (err) {
      setStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(() => {
      checkStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [phoneInput, setPhoneInput] = useState<string>('');

  const handleConnect = async (usePhone?: boolean) => {
    setIsConnecting(true);
    setStatus('connecting');
    setErrorMessage(null);
    setQrCodeImg(null);
    setPairingCode(null);

    try {
      const body: any = { action: 'connect' };
      if (usePhone && phoneInput.trim()) {
        body.phone = phoneInput.trim();
      }

      const res = await fetch('/api/whatsapp/instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.status === 'error') {
        setErrorMessage(data.message || 'Falha ao conectar ao servidor de WhatsApp.');
        setStatus('disconnected');
        return;
      }

      if (data.qrCode) {
        const src = data.qrCode.startsWith('data:')
          ? data.qrCode
          : `data:image/png;base64,${data.qrCode}`;
        setQrCodeImg(src);
      }

      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
      }
    } catch (err: any) {
      console.error('Erro ao conectar WhatsApp:', err);
      setErrorMessage('Erro de rede ao tentar se comunicar com a API.');
      setStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRestart = async () => {
    setIsConnecting(true);
    setStatus('connecting');
    setErrorMessage(null);
    setQrCodeImg(null);
    setPairingCode(null);

    try {
      const res = await fetch('/api/whatsapp/instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restart' })
      });
      const data = await res.json();

      if (data.qrCode) {
        const src = data.qrCode.startsWith('data:')
          ? data.qrCode
          : `data:image/png;base64,${data.qrCode}`;
        setQrCodeImg(src);
      }
      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
      }
      if (data.status === 'error') {
        setErrorMessage(data.message || 'Falha ao reiniciar a conexão de WhatsApp.');
        setStatus('disconnected');
      }
    } catch (err: any) {
      console.error('Erro ao reiniciar WhatsApp:', err);
      setErrorMessage('Erro de rede ao tentar reiniciar a instância.');
      setStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Deseja desconectar este número de WhatsApp?')) return;
    try {
      await fetch('/api/whatsapp/instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });
      setStatus('disconnected');
      setPhone('');
      setQrCodeImg(null);
      setPairingCode(null);
    } catch (err) {
      console.error('Erro ao desconectar:', err);
    }
  };

  return (
    <div>
      <Header
        title="Conexão do WhatsApp Business"
        subtitle="Vincule o número de WhatsApp da sua empresa para ativar as respostas automáticas da Inteligência Artificial"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={handleRestart}
              disabled={isConnecting}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shrink-0 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>Reiniciar Conexão</span>
            </button>
          </div>
        )}

        {/* Status Card Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
              status === 'connected' ? 'bg-[#00E676] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Status da Conexão</h3>
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
                    Verificando...
                  </span>
                ) : status === 'connected' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                    Online & Operando
                  </span>
                ) : status === 'connecting' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    Gerando QR Code...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                    <WifiOff className="w-3 h-3 text-rose-600" />
                    Desconectado
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {status === 'connected'
                  ? `Conectado com sucesso ao número ${phone}.`
                  : 'Clique no botão abaixo para gerar o QR Code de conexão e parear o WhatsApp do seu negócio.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {status === 'connected' ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Desconectar Número</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleConnect(false)}
                  disabled={isConnecting}
                  className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#43A047] text-[#171901] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>Gerar QR Code</span>
                </button>

                <button
                  onClick={handleRestart}
                  disabled={isConnecting}
                  title="Limpa sessões travadas e recria a conexão do zero"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>Reiniciar Sessão</span>
                </button>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                  <input
                    type="text"
                    placeholder="DDD + Número (ex: 11999999999)"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 w-44 focus:outline-none focus:border-[#00E676] font-mono"
                  />
                  <button
                    onClick={() => handleConnect(true)}
                    disabled={isConnecting || !phoneInput.trim()}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
                  >
                    <span>Código</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* QR Code & Guide Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* QR Code Card */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[320px]">
            {status === 'connected' ? (
              <div className="py-6 px-4 space-y-4 w-full">
                <div className="relative w-20 h-20 mx-auto">
                  {profilePicUrl ? (
                    <img
                      src={profilePicUrl}
                      alt={profileName || 'WhatsApp'}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#00E676] shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#F4F5F4] rounded-full flex items-center justify-center text-[#2E7D5A] border border-emerald-200 shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00E676] border-2 border-white rounded-full flex items-center justify-center shadow">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">{profileName || 'WhatsApp Conectado'}</h4>
                  <div className="inline-block bg-[#F4F5F4] border border-emerald-200 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm">
                    {phone}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                    Seu número está ativo e sincronizado. Mensagens recebidas acionam a Inteligência Artificial e aparecem no Inbox em tempo real.
                  </p>
                </div>
              </div>
            ) : qrCodeImg ? (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-white rounded-2xl border-2 border-[#00E676] shadow-lg inline-block">
                  <img src={qrCodeImg} alt="QR Code WhatsApp" className="w-56 h-56 object-contain" />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#2E7D5A]">QR Code Prontinho!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Abra seu WhatsApp &gt; Dispositivos Conectados e escaneie a imagem acima.</p>
                </div>

                <button
                  onClick={() => handleConnect(false)}
                  disabled={isConnecting}
                  className="text-xs text-[#128C7E] hover:underline font-semibold flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>Atualizar QR Code</span>
                </button>

                {pairingCode && (
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400">Código de Conexão alternativo:</p>
                    <p className="font-mono text-sm font-bold text-slate-800 tracking-wider bg-slate-100 py-1 px-3 rounded-lg inline-block mt-1">{pairingCode}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 py-8 text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <QrCode className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Aguardando geração do QR Code</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Clique no botão <strong>"Gerar QR Code de Conexão"</strong> acima para sincronizar com o WhatsApp.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Step-by-Step */}
          <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-[#2E7D5A]" />
              <span>Como conectar o WhatsApp da sua empresa</span>
            </div>

            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#2E7D5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Abra o aplicativo WhatsApp no seu celular</p>
                  <p className="text-[11px] text-slate-500">Utilize preferencialmente a versão WhatsApp Business do seu número comercial.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#2E7D5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Acesse o menu de Dispositivos Conectados</p>
                  <p className="text-[11px] text-slate-500">No Android: Toque nos 3 pontos verticais &gt; <strong>Dispositivos conectados</strong>. No iPhone: Ajustes &gt; <strong>Dispositivos conectados</strong>.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#2E7D5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Toque em "Conectar um dispositivo"</p>
                  <p className="text-[11px] text-slate-500">Aponte a câmera do seu celular para o QR Code gerado nesta tela.</p>
                </div>
              </li>
            </ol>

            <div className="p-3.5 bg-[#F4F5F4]/50 rounded-xl border border-emerald-100 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D5A] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-emerald-900">
                <strong>Conexão Protegida:</strong> Suas conversas utilizam criptografia de ponta a ponta e integração segura com a API do WhatsApp.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

