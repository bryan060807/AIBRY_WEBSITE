import {
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const requiredEnv = [
  "AIBRY_STORAGE_DRIVER",
  "AIBRY_S3_ENDPOINT",
  "AIBRY_S3_REGION",
  "AIBRY_S3_BUCKET",
  "AIBRY_S3_ACCESS_KEY_ID",
  "AIBRY_S3_SECRET_ACCESS_KEY",
  "AIBRY_MEDIA_PUBLIC_URL",
];

function requireConfig() {
  const missing = requiredEnv.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  const driver = process.env.AIBRY_STORAGE_DRIVER.trim().toLowerCase();
  if (driver !== "s3" && driver !== "minio") {
    throw new Error("AIBRY_STORAGE_DRIVER must be s3 or minio for this smoke test.");
  }
}

function buildPublicUrl(objectKey) {
  return `${process.env.AIBRY_MEDIA_PUBLIC_URL.replace(/\/$/, "")}/${objectKey
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function sanitizedErrorDetails(operation, error) {
  const metadata = error?.$metadata;
  return {
    operation,
    name: error?.name,
    code: error?.Code ?? error?.code,
    message: error instanceof Error ? error.message : String(error),
    httpStatusCode: metadata?.httpStatusCode,
    requestId: metadata?.requestId,
    extendedRequestId: metadata?.extendedRequestId,
    attempts: metadata?.attempts,
  };
}

function reportSanitizedError(operation, error) {
  console.error("S3 operation failed:");
  console.error(JSON.stringify(sanitizedErrorDetails(operation, error), null, 2));
}

async function runOperation(operation, callback) {
  try {
    return await callback();
  } catch (error) {
    reportSanitizedError(operation, error);
    throw error;
  }
}

async function publicHeadCheck(publicUrl) {
  const response = await fetch(publicUrl, { method: "HEAD" });
  if (!response.ok) {
    throw new Error(`Public media HEAD check failed with HTTP ${response.status}.`);
  }
}

async function main() {
  requireConfig();
  console.log(`Config presence OK: ${requiredEnv.join(", ")}`);

  const client = new S3Client({
    endpoint: process.env.AIBRY_S3_ENDPOINT,
    region: process.env.AIBRY_S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AIBRY_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AIBRY_S3_SECRET_ACCESS_KEY,
    },
  });

  const bucket = process.env.AIBRY_S3_BUCKET;
  const objectKey = `avatars/__storage-smoke__/avatar-smoke-${Date.now()}.txt`;
  const body = Buffer.from(`aibry-storage-smoke ${new Date().toISOString()}\n`);
  const publicUrl = buildPublicUrl(objectKey);

  console.log("Checking S3 bucket reachability...");
  await runOperation("HeadBucket", () => client.send(new HeadBucketCommand({ Bucket: bucket })));

  try {
    console.log(`Uploading test object under ${objectKey}...`);
    await runOperation("PutObject", () =>
      client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Body: body,
          ContentType: "text/plain; charset=utf-8",
          CacheControl: "no-store",
        })
      )
    );

    console.log("Checking uploaded object with S3 HEAD...");
    await runOperation("HeadObject", () =>
      client.send(new HeadObjectCommand({ Bucket: bucket, Key: objectKey }))
    );

    console.log("Checking public media URL with HTTP HEAD...");
    await runOperation("PublicHead", () => publicHeadCheck(publicUrl));

    console.log("S3 storage smoke passed.");
  } finally {
    console.log(`Cleaning up only test object ${objectKey}...`);
    await runOperation("DeleteObject", () =>
      client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }))
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "S3 storage smoke failed.");
  process.exitCode = 1;
});
