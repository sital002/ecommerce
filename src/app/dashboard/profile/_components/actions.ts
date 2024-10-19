"use server";

import { UTApi } from "uploadthing/server";

export async function uploadFiles(formData: FormData) {
  const utApi = new UTApi();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);
  console.log(files);
  const response = await utApi.uploadFiles(files);
  return response;
}

export async function deleteFiles(key: string) {
  const utApi = new UTApi();
  try {
    const response = await utApi.deleteFiles(key);
    if (response.success) {
      return { success: true, error: null };
    }
  } catch (err) {
    return { success: true, error: err };
  }
}
