// Se reemplaza s3.send por un "S3 falso" que guarda los archivos en memoria
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { s3 } from '../src/config/s3.js';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../src/servidor.js');

let archivos = {};
let s3Caido = false;

s3.send = async (comando) => {
  if (s3Caido) throw new Error('S3 no responde');

  const clave = comando.input.Key;

  if ('Body' in comando.input) {
    archivos[clave] = comando.input.Body;
    return {};
  }

  if (!(clave in archivos)) {
    const error = new Error('No existe');
    error.name = 'NoSuchKey';
    throw error;
  }

  return { Body: { transformToString: async () => archivos[clave] } };
};

let servidor;
let URL_API;

async function pedir(ruta, metodo = 'GET', cuerpo) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    method: metodo,
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = respuesta.status === 204 ? null : await respuesta.json();
  return { estado: respuesta.status, datos };
}

before(() => {
  servidor = app.listen(0);
  URL_API = `http://127.0.0.1:${servidor.address().port}/api`;
});

after(() => servidor.close());

beforeEach(() => {
  archivos = {};
  s3Caido = false;
});

describe('Salud', () => {
  it('responde que el servidor funciona', async () => {
    const { estado, datos } = await pedir('/salud');
    assert.equal(estado, 200);
    assert.equal(datos.estado, 'ok');
  });
});

describe('Columnas', () => {
  it('devuelve las 3 columnas iniciales', async () => {
    const { estado, datos } = await pedir('/columnas');
    assert.equal(estado, 200);
    assert.deepEqual(datos.map((c) => c.id), ['todo', 'in-progress', 'done']);
  });

  it('crea una columna nueva', async () => {
    const { estado, datos } = await pedir('/columnas', 'POST', { name: '  Revisión  ' });
    assert.equal(estado, 201);
    assert.equal(datos.name, 'Revisión');

    const { datos: columnas } = await pedir('/columnas');
    assert.equal(columnas.length, 4);
  });

  it('no crea una columna sin nombre', async () => {
    const { estado } = await pedir('/columnas', 'POST', { name: '   ' });
    assert.equal(estado, 400);
  });

  it('edita el nombre de una columna', async () => {
    const { estado, datos } = await pedir('/columnas/todo', 'PATCH', { name: 'Pendientes' });
    assert.equal(estado, 200);
    assert.equal(datos.name, 'Pendientes');
  });

  it('responde 404 al editar una columna que no existe', async () => {
    const { estado } = await pedir('/columnas/no-existe', 'PATCH', { name: 'X' });
    assert.equal(estado, 404);
  });

  it('al eliminar una columna también elimina sus tareas', async () => {
    await pedir('/tareas', 'POST', { title: 'Tarea en todo', column: 'todo' });

    const { estado } = await pedir('/columnas/todo', 'DELETE');
    assert.equal(estado, 204);

    const { datos: columnas } = await pedir('/columnas');
    const { datos: tareas } = await pedir('/tareas');
    assert.ok(!columnas.some((c) => c.id === 'todo'));
    assert.equal(tareas.length, 0);
  });
});

describe('Tareas', () => {
  it('empieza sin tareas', async () => {
    const { estado, datos } = await pedir('/tareas');
    assert.equal(estado, 200);
    assert.deepEqual(datos, []);
  });

  it('crea una tarea y limpia los espacios del título', async () => {
    const { estado, datos } = await pedir('/tareas', 'POST', {
      title: '  Hacer pruebas  ',
      column: 'todo',
    });
    assert.equal(estado, 201);
    assert.equal(datos.title, 'Hacer pruebas');
    assert.equal(datos.column, 'todo');
    assert.equal(datos.color, '#2f6f4f');
  });

  it('no crea una tarea sin título', async () => {
    const { estado } = await pedir('/tareas', 'POST', { title: '', column: 'todo' });
    assert.equal(estado, 400);
  });

  it('no crea una tarea en una columna que no existe', async () => {
    const { estado } = await pedir('/tareas', 'POST', { title: 'Hola', column: 'no-existe' });
    assert.equal(estado, 400);
  });

  it('mueve una tarea a otra columna (drag & drop)', async () => {
    const { datos: tarea } = await pedir('/tareas', 'POST', { title: 'Mover', column: 'todo' });

    const { estado, datos } = await pedir(`/tareas/${tarea.id}`, 'PATCH', { column: 'done' });
    assert.equal(estado, 200);
    assert.equal(datos.column, 'done');
  });

  it('no mueve una tarea a una columna que no existe', async () => {
    const { datos: tarea } = await pedir('/tareas', 'POST', { title: 'Mover', column: 'todo' });

    const { estado } = await pedir(`/tareas/${tarea.id}`, 'PATCH', { column: 'no-existe' });
    assert.equal(estado, 400);
  });

  it('elimina una tarea y luego responde 404 si se vuelve a eliminar', async () => {
    const { datos: tarea } = await pedir('/tareas', 'POST', { title: 'Borrar', column: 'todo' });

    const primera = await pedir(`/tareas/${tarea.id}`, 'DELETE');
    assert.equal(primera.estado, 204);

    const segunda = await pedir(`/tareas/${tarea.id}`, 'DELETE');
    assert.equal(segunda.estado, 404);
  });
});

describe('Errores', () => {
  it('responde 500 si S3 falla', async () => {
    s3Caido = true;
    const { estado, datos } = await pedir('/tareas');
    assert.equal(estado, 500);
    assert.equal(datos.error, 'Error al consultar tareas');
  });
});
