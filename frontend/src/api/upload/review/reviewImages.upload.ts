import request from "@/utils/request";

export const uploadReviewImages = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) return [];

  if (files.length > 5) {
    throw new Error("You can upload a maximum of 5 images.");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await request.post("/upload/review-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.uploadedUrls || [];
};
