import { COLORES_PREDEFINIDOS } from '../constantes.js';

export default function FilaColores({ colorActivo, alElegir }) {
  return (
    <div className="swatch-row">
      {COLORES_PREDEFINIDOS.map(({ label, value }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className={'swatch' + (colorActivo === value ? ' swatch-active' : '')}
          style={{ background: value || 'var(--color-surface)' }}
          onClick={() => alElegir(value)}
        >
          {value ? '' : '✕'}
        </button>
      ))}
    </div>
  );
}
