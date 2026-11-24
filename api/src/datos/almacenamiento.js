import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, bucket } from '../config/s3.js';

export async function leerDatos(nombreArchivo, datosIniciales = []) {
  try {
    const respuesta = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: `datos/${nombreArchivo}.json`
      })
    );

    const contenido = await respuesta.Body.transformToString();
    return JSON.parse(contenido);
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
      await guardarDatos(nombreArchivo, datosIniciales);
      return datosIniciales;
    }

    throw error;
  }
}

export async function guardarDatos(nombreArchivo, datos) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: `datos/${nombreArchivo}.json`,
      Body: JSON.stringify(datos, null, 2),
      ContentType: 'application/json'
    })
  );

  return datos;
}