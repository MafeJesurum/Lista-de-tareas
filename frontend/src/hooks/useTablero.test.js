import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTablero } from './useTablero.js';
import { api } from '../servicios/api.js';

vi.mock('../servicios/api.js', () => ({
  api: {
    obtenerColumnas: vi.fn(),
    crearColumna: vi.fn(),
    editarColumna: vi.fn(),
    eliminarColumna: vi.fn(),
    obtenerTareas: vi.fn(),
    crearTarea: vi.fn(),
    editarTarea: vi.fn(),
    eliminarTarea: vi.fn(),
  },
}));

const columnas = [
  { id: 'todo', name: 'Por Hacer', color: null },
  { id: 'done', name: 'Completadas', color: null },
];

const tareas = [
  { id: 1, title: 'Tarea 1', column: 'todo' },
  { id: 2, title: 'Tarea 2', column: 'done' },
];

async function montar() {
  const { result } = renderHook(() => useTablero());
  await waitFor(() => expect(result.current.cargando).toBe(false));
  return result;
}

beforeEach(() => {
  vi.clearAllMocks();
  api.obtenerColumnas.mockResolvedValue(columnas);
  api.obtenerTareas.mockResolvedValue(tareas);
});

describe('useTablero', () => {
  it('carga las columnas y las tareas al iniciar', async () => {
    const result = await montar();
    expect(result.current.columnas).toEqual(columnas);
    expect(result.current.tareas).toEqual(tareas);
    expect(result.current.error).toBeNull();
  });

  it('muestra un error si no se puede cargar el tablero', async () => {
    api.obtenerTareas.mockRejectedValue(new Error('sin conexión'));
    const result = await montar();
    expect(result.current.error).toBe('No se pudo cargar el tablero: sin conexión');
  });

  it('crea una tarea', async () => {
    const nueva = { id: 3, title: 'Nueva', column: 'todo' };
    api.crearTarea.mockResolvedValue(nueva);
    const result = await montar();

    let ok;
    await act(async () => {
      ok = await result.current.crearTarea({ title: 'Nueva', column: 'todo' });
    });

    expect(ok).toBe(true);
    expect(result.current.tareas).toContainEqual(nueva);
  });

  it('mueve una tarea a otra columna (drag & drop)', async () => {
    api.editarTarea.mockResolvedValue({ ...tareas[0], column: 'done' });
    const result = await montar();

    await act(async () => {
      await result.current.moverTarea(1, 'done');
    });

    expect(api.editarTarea).toHaveBeenCalledWith(1, { column: 'done' });
    expect(result.current.tareas.find((t) => t.id === 1).column).toBe('done');
  });

  it('elimina una tarea', async () => {
    api.eliminarTarea.mockResolvedValue(null);
    const result = await montar();

    await act(async () => {
      await result.current.eliminarTarea(1);
    });

    expect(result.current.tareas.map((t) => t.id)).toEqual([2]);
  });

  it('al eliminar una columna también quita sus tareas', async () => {
    api.eliminarColumna.mockResolvedValue(null);
    const result = await montar();

    await act(async () => {
      await result.current.eliminarColumna('todo');
    });

    expect(result.current.columnas.map((c) => c.id)).toEqual(['done']);
    expect(result.current.tareas.map((t) => t.id)).toEqual([2]);
  });

  it('si la API falla devuelve false y guarda el error', async () => {
    api.crearTarea.mockRejectedValue(new Error('El título y la columna son obligatorios'));
    const result = await montar();

    let ok;
    await act(async () => {
      ok = await result.current.crearTarea({ title: '' });
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe('El título y la columna son obligatorios');
    expect(result.current.tareas).toEqual(tareas);
  });
});
