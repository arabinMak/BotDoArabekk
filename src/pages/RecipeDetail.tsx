import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, Recipe } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, Flame, Heart, Play, Pause } from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
    checkFavorite();
  }, [id]);

  const loadRecipe = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setRecipe(data);
    }
    setLoading(false);
  };

  const checkFavorite = async () => {
    if (!user || !id) return;

    const { data } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('recipe_id', id)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user || !id) return;

    if (isFavorite) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', id);
      setIsFavorite(false);
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, recipe_id: id });
      setIsFavorite(true);
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#8B7355]">Carregando receita...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-[#A68A7A] mb-4">Receita não encontrada</p>
        <button
          onClick={() => navigate('/receitas')}
          className="text-[#8B7355] hover:underline"
        >
          Voltar para receitas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate('/receitas')}
        className="flex items-center gap-2 text-[#8B7355] hover:text-[#A68A7A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="relative">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-80 object-cover"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#8B7355] mb-2">{recipe.name}</h1>
              <p className="text-[#A68A7A]">{recipe.description}</p>
            </div>
          </div>

          <div className="flex gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-[#8B7355]">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{recipe.prep_time} minutos</span>
            </div>
            <div className="flex items-center gap-2 text-[#8B7355]">
              <Flame className="w-5 h-5" />
              <span className="font-medium">{recipe.calories} kcal</span>
            </div>
          </div>

          {recipe.audio_url && (
            <div className="mb-8 bg-[#FFF8F0] p-4 rounded-xl">
              <button
                onClick={handlePlayAudio}
                className="flex items-center gap-3 text-[#8B7355] hover:text-[#A68A7A] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                <span className="font-medium">
                  {isPlaying ? 'Pausar' : 'Ouvir'} receita narrada
                </span>
              </button>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#8B7355] mb-4">Ingredientes</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#E6D5FF] rounded-full mt-2"></span>
                  <span className="text-[#A68A7A]">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#8B7355] mb-4">Modo de Preparo</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] rounded-full flex items-center justify-center text-[#8B7355] font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-[#A68A7A] pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#FFF8F0] text-[#8B7355] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
