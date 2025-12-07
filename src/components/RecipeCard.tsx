import { Clock } from 'lucide-react';

interface RecipeCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  tags: string[];
  onViewRecipe: () => void;
}

export default function RecipeCard({ name, description, imageUrl, tags, onViewRecipe }: RecipeCardProps) {
  const defaultImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="relative">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-[16px] font-bold text-[#3E3E3E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {name}
        </h3>

        {description && (
          <p className="text-[13px] text-[#6B6B6B] mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 bg-[#F0F9F4] text-[#6FAF96] font-semibold rounded-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onViewRecipe}
          className="w-full bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:from-[#8BC4B4] hover:to-[#9DD4A3] transition-all text-[14px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Ver receita
        </button>
      </div>
    </div>
  );
}
