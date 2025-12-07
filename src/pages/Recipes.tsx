import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Recipe } from '../lib/supabase';
import { Clock, Flame, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  const categories = ['Todos', 'Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Lanche'];

  useEffect(() => {
    loadRecipes();
    loadFavorites();
  }, []);

  const loadRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('category', { ascending: true });

    if (data) {
      setRecipes(data);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_favorites')
      .select('recipe_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(new Set(data.map((f) => f.recipe_id)));
    }
  };

  const toggleFavorite = async (recipeId: string) => {
    if (!user) return;

    if (favorites.has(recipeId)) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, recipe_id: recipeId });

      setFavorites(prev => new Set(prev).add(recipeId));
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    selectedCategory === 'Todos' || recipe.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#8B7355]">Carregando receitas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B7355] mb-2">Minhas Receitas</h1>
        <p className="text-[#A68A7A]">Todas sem glúten e sem lactose</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] shadow-md'
                : 'bg-white text-[#A68A7A] hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#A68A7A]">Nenhuma receita encontrada nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(recipe.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
                {recipe.is_bonus && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] px-3 py-1 rounded-full text-xs font-semibold">
                    Bônus
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-[#8B7355] mb-2">{recipe.name}</h3>
                <p className="text-sm text-[#A68A7A] mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-[#A68A7A]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prep_time}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    <span>{recipe.calories} kcal</span>
                  </div>
                </div>

                <Link
                  to={`/receita/${recipe.id}`}
                  className="block w-full bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] font-semibold py-2 px-4 rounded-xl text-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Ver Receita
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
