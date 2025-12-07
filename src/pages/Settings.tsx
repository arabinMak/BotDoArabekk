import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, LogOut, Trash2 } from 'lucide-react';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (error) throw error;
      setMessage('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setMessage(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await supabase.from('user_favorites').delete().eq('user_id', user.id);
      await supabase.from('daily_check_ins').delete().eq('user_id', user.id);
      await supabase.from('user_progress').delete().eq('user_id', user.id);
      await supabase.from('generated_menus').delete().eq('user_id', user.id);

      await signOut();
      navigate('/');
    } catch (err: any) {
      setMessage('Erro ao deletar conta. Tente novamente.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B7355] mb-2">Configurações</h1>
        <p className="text-[#A68A7A]">Gerencie sua conta e preferências</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-[#8B7355] mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B7355] mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6D5FF] transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B7355] mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-[#A68A7A] mt-1">
              O e-mail não pode ser alterado
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                message.includes('sucesso')
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-[#8B7355] mb-4 flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Sessão
        </h2>
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-100 text-[#8B7355] font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
        >
          Sair da Conta
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-red-100">
        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Zona de Perigo
        </h2>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-50 text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-red-100 transition-all"
          >
            Deletar Conta
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#A68A7A]">
              Tem certeza? Esta ação não pode ser desfeita. Todos os seus dados serão
              permanentemente removidos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-[#8B7355] font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Deletando...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
