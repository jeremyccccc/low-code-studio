import type { ReactNode } from 'react';
import {
  AppstoreOutlinedIcon,
  BorderOutlinedIcon,
  CalendarOutlinedIcon,
  CaretDownOutlinedIcon,
  CheckCircleOutlinedIcon,
  FontSizeOutlinedIcon,
  HighlightOutlinedIcon,
} from './ant-icons';
import type { MaterialDefinition } from '../core/types';

type MaterialLibraryProps = {
  materials: MaterialDefinition[];
  draggedMaterialType: string | null;
  onAdd: (materialType: string) => void;
  onMaterialDragStart: (materialType: string) => void;
  onMaterialDragEnd: () => void;
};

export function MaterialLibrary({
  materials,
  draggedMaterialType,
  onAdd,
  onMaterialDragStart,
  onMaterialDragEnd,
}: MaterialLibraryProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>物料区</h2>
        <span>拖到画布创建</span>
      </div>
      <div className="material-grid">
        {materials.map((material) => (
          <button
            key={material.type}
            className={draggedMaterialType === material.type ? 'material-icon-card material-icon-card-dragging' : 'material-icon-card'}
            draggable
            title={material.description}
            onClick={() => onAdd(material.type)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = 'copy';
              event.dataTransfer.setData('text/plain', material.type);
              onMaterialDragStart(material.type);
            }}
            onDragEnd={onMaterialDragEnd}
          >
            <span className="material-icon-glyph">{getMaterialGlyph(material.icon)}</span>
            <strong>{material.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function getMaterialGlyph(icon: string): ReactNode {
  const glyphMap: Record<string, ReactNode> = {
    Layout: <BorderOutlinedIcon />,
    Type: <FontSizeOutlinedIcon />,
    Pointer: <HighlightOutlinedIcon />,
    Sparkles: <AppstoreOutlinedIcon />,
    Select: <CaretDownOutlinedIcon />,
    Calendar: <CalendarOutlinedIcon />,
    Radio: <CheckCircleOutlinedIcon />,
  };

  return glyphMap[icon] ?? <AppstoreOutlinedIcon />;
}
