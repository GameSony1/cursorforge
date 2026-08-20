import type { CatalogItem } from '../lib/catalog';
import { ShapePreview } from './ShapePreview';

interface Props {
  item: CatalogItem;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function CursorCard({ item, selected, favorite, onSelect, onToggleFavorite }: Props) {
  return (
    <button className={`cursor-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <span
        className={`fav-star ${favorite ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        ★
      </span>
      {!item.free && <span className="pro-pill">PRO</span>}
      <div className="cursor-card-preview">
        {item.image ? (
          <img src={item.image.idleUrl} alt={item.name} width={56} height={56} style={{ objectFit: 'contain' }} />
        ) : (
          <ShapePreview shape={item.shape!} color={item.color!} size={56} />
        )}
      </div>
      <span className="cursor-card-name">{item.name}</span>
    </button>
  );
}
