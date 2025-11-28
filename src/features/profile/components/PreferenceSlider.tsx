import { useState } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function PreferenceSlider({ label, value, onChange }: Props) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const displayValue = hoveredStar !== null ? hoveredStar : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">{label}</span>
        <span className="text-sm text-[#9AA6B2] font-medium">
          {displayValue}점
        </span>
      </div>

      {/* 별점 선택 */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <svg
              className={`w-10 h-10 transition-all ${
                star <= displayValue
                  ? 'text-yellow-400 fill-current'
                  : 'text-[#D9EAFD] fill-current'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>

      {/* 슬라이더 */}
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}
