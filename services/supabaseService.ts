
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const initSupabase = (url: string, key: string) => {
  try {
    supabase = createClient(url, key);
    return true;
  } catch (error) {
    console.error('Falha ao iniciar Supabase:', error);
    return false;
  }
};

export const getSupabase = () => supabase;

// Funções de Sincronização
export const syncTable = (table: string, onUpdate: (data: any[]) => void) => {
  if (!supabase) return () => {};

  // Busca inicial
  supabase.from(table).select('*').then(({ data }) => {
    if (data) onUpdate(data);
  });

  // Escuta em tempo real
  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
      // Recarrega a lista completa para manter consistência
      supabase!.from(table).select('*').then(({ data }) => {
        if (data) onUpdate(data);
      });
    })
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
};

export const saveToCloud = async (table: string, data: any) => {
  if (!supabase) return;
  const { error } = await supabase.from(table).upsert(data);
  if (error) console.error(`Erro ao salvar em ${table}:`, error);
};

export const deleteFromCloud = async (table: string, id: string) => {
  if (!supabase) return;
  await supabase.from(table).delete().eq('id', id);
};
