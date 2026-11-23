const CLASES = {
  primario: 'btn btn-primary',
  secundario: 'btn btn-secondary',
  peligro: 'btn btn-danger',
};

export default function Boton({ children, alHacerClic, variante = 'primario', deshabilitado = false }) {
  return (
    <button type="button" className={CLASES[variante]} onClick={alHacerClic} disabled={deshabilitado}>
      {children}
    </button>
  );
}
