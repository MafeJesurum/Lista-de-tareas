
import 'dotenv/config';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.S3_BUCKET;

// AWS SDK utiliza las credenciales temporales del archivo .env
const s3 = new S3Client({
  region
});

export async function verificarBucket() {
  if (!bucket) {
    throw new Error('No se ha configurado S3_BUCKET');
  }

  await s3.send(
    new HeadBucketCommand({
      Bucket: bucket
    })
  );

  return true;
}

export { s3, bucket };
