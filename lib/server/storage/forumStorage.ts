import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const S3_DRIVER_VALUES = new Set(["s3", "minio"]);

interface ForumStorageConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  mediaPublicUrl: string;
}

export interface StoreForumObjectInput {
  userId: string;
  postId: string;
  file: File;
}

export interface StoreForumObjectResult {
  objectPath: string;
  publicUrl: string;
  driver: "s3";
}

export function isForumObjectStorageConfigured() {
  const driver = process.env.AIBRY_STORAGE_DRIVER?.trim().toLowerCase();
  return S3_DRIVER_VALUES.has(driver ?? "") && getMissingForumStorageEnvNames().length === 0;
}

export function getForumStorageEnvNames() {
  return [
    "AIBRY_STORAGE_DRIVER",
    "AIBRY_S3_ENDPOINT",
    "AIBRY_S3_REGION",
    "AIBRY_S3_BUCKET",
    "AIBRY_S3_ACCESS_KEY_ID",
    "AIBRY_S3_SECRET_ACCESS_KEY",
    "AIBRY_MEDIA_PUBLIC_URL",
  ] as const;
}

export function getMissingForumStorageEnvNames() {
  const config = readRawConfig();

  return Object.entries(config)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => envNameForConfigKey(key));
}

export async function storeForumObject({
  userId,
  postId,
  file,
}: StoreForumObjectInput): Promise<StoreForumObjectResult> {
  const driver = process.env.AIBRY_STORAGE_DRIVER?.trim().toLowerCase();

  if (!S3_DRIVER_VALUES.has(driver ?? "")) {
    throw new Error("FORUM_OBJECT_STORAGE_NOT_CONFIGURED");
  }

  const config = readForumStorageConfig();
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const objectPath = buildForumObjectPath(userId, postId, file.name);
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectPath,
      Body: body,
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    objectPath,
    publicUrl: buildPublicMediaUrl(config.mediaPublicUrl, objectPath),
    driver: "s3",
  };
}

function buildForumObjectPath(userId: string, postId: string, fileName: string) {
  const safeUserId = safePathSegment(userId);
  const safePostId = safePathSegment(postId);
  const extension = getExtension(fileName);

  return `forum/${safeUserId}/${safePostId}/${Date.now()}${extension}`;
}

function safePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "unknown";
}

function getExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot < 0) return "";

  const extension = fileName.slice(lastDot).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return extension.length <= 12 ? extension : "";
}

function readForumStorageConfig(): ForumStorageConfig {
  const config = readRawConfig();
  const missing = getMissingForumStorageEnvNames();

  if (missing.length) {
    throw new Error(`Forum object storage is missing required configuration: ${missing.join(", ")}`);
  }

  return {
    endpoint: config.endpoint!,
    region: config.region!,
    bucket: config.bucket!,
    accessKeyId: config.accessKeyId!,
    secretAccessKey: config.secretAccessKey!,
    mediaPublicUrl: config.mediaPublicUrl!,
  };
}

function readRawConfig() {
  return {
    endpoint: process.env.AIBRY_S3_ENDPOINT,
    region: process.env.AIBRY_S3_REGION,
    bucket: process.env.AIBRY_S3_BUCKET,
    accessKeyId: process.env.AIBRY_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AIBRY_S3_SECRET_ACCESS_KEY,
    mediaPublicUrl: process.env.AIBRY_MEDIA_PUBLIC_URL,
  };
}

function envNameForConfigKey(key: string): string {
  switch (key) {
    case "endpoint":
      return "AIBRY_S3_ENDPOINT";
    case "region":
      return "AIBRY_S3_REGION";
    case "bucket":
      return "AIBRY_S3_BUCKET";
    case "accessKeyId":
      return "AIBRY_S3_ACCESS_KEY_ID";
    case "secretAccessKey":
      return "AIBRY_S3_SECRET_ACCESS_KEY";
    case "mediaPublicUrl":
      return "AIBRY_MEDIA_PUBLIC_URL";
    default:
      return key;
  }
}

function buildPublicMediaUrl(mediaPublicUrl: string, objectPath: string): string {
  return `${mediaPublicUrl.replace(/\/$/, "")}/${objectPath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
