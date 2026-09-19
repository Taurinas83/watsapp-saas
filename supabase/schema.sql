-- Habilitar extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE ORGANIZAÇÕES (Empresas Clientes)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABELA DE PERFIS DE USUÁRIOS (Vinculados a auth.users e organizações)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'operator')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA DO ATENDENTE VIRTUAL (Configurações da IA & WhatsApp)
CREATE TABLE IF NOT EXISTS public.attendants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL DEFAULT 'Assistente Virtual',
    personality TEXT NOT NULL DEFAULT 'professional' CHECK (personality IN ('friendly', 'professional', 'casual')),
    voice_tone TEXT DEFAULT 'Atencioso, prestativo e direto ao ponto',
    business_info TEXT DEFAULT '',
    custom_instructions TEXT DEFAULT '',
    whatsapp_status TEXT NOT NULL DEFAULT 'disconnected' CHECK (whatsapp_status IN ('disconnected', 'connecting', 'connected')),
    whatsapp_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABELA DA BASE DE CONHECIMENTO (RAG / FAQs / Produtos / Horários)
CREATE TABLE IF NOT EXISTS public.knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'faq' CHECK (category IN ('faq', 'product', 'pricing', 'hours', 'general')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABELA DE CONVERSAS (Histórico de Atendimento WhatsApp)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_phone TEXT NOT NULL,
    customer_name TEXT DEFAULT 'Cliente',
    status TEXT NOT NULL DEFAULT 'bot_active' CHECK (status IN ('bot_active', 'waiting_human', 'human_active', 'closed')),
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    tags TEXT[] DEFAULT '{}',
    internal_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABELA DE MENSAGENS DE CHAT
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'bot', 'operator')),
    sender_name TEXT,
    content TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false,
    ai_suggestion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO AUXILIAR PARA OBTER O ORGANIZATION_ID DO USUÁRIO ATUAL
CREATE OR REPLACE FUNCTION public.get_auth_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLÍTICAS RLS DE PROFILES
CREATE POLICY "Permitir leitura de perfis da mesma organizacao" ON public.profiles
    FOR SELECT USING (organization_id = public.get_auth_user_organization_id());

CREATE POLICY "Permitir atualizacao do proprio perfil" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

-- POLÍTICAS RLS DE ORGANIZATIONS
CREATE POLICY "Permitir leitura da propria organizacao" ON public.organizations
    FOR SELECT USING (id = public.get_auth_user_organization_id());

-- POLÍTICAS RLS DE ATTENDANTS
CREATE POLICY "Permitir acesso aos atendentes da organizacao" ON public.attendants
    FOR ALL USING (organization_id = public.get_auth_user_organization_id());

-- POLÍTICAS RLS DE KNOWLEDGE_ITEMS
CREATE POLICY "Permitir acesso a base de conhecimento da organizacao" ON public.knowledge_items
    FOR ALL USING (organization_id = public.get_auth_user_organization_id());

-- POLÍTICAS RLS DE CONVERSATIONS
CREATE POLICY "Permitir acesso as conversas da organizacao" ON public.conversations
    FOR ALL USING (organization_id = public.get_auth_user_organization_id());

-- POLÍTICAS RLS DE MESSAGES
CREATE POLICY "Permitir acesso as mensagens da organizacao" ON public.messages
    FOR ALL USING (organization_id = public.get_auth_user_organization_id());

-- ÍNDICES PARA ALTA PERFORMANCE DE CONSULTA
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_org ON public.knowledge_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_org_phone ON public.conversations(organization_id, customer_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);

-- TRIGGER DE CRIÇÃO AUTOMÁTICA DE PERFIL E ORGANIZAÇÃO APÓS SIGNUP NO SUPABASE
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Criar nova organização para o usuário
    INSERT INTO public.organizations (name)
    VALUES (COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Empresa'))
    RETURNING id INTO new_org_id;

    -- Criar perfil atrelado à organização
    INSERT INTO public.profiles (id, organization_id, full_name, email, role)
    VALUES (
        new.id,
        new_org_id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        new.email,
        'admin'
    );

    -- Criar atendente virtual padrão para a organização
    INSERT INTO public.attendants (organization_id, name, personality, voice_tone)
    VALUES (
        new_org_id,
        'Atendente Virtual',
        'professional',
        'Atencioso, prestativo e eficiente'
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER NO AUTH.USERS DO SUPABASE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
