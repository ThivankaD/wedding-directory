import request from "@/utils/request";

/**
 * Upload multiple images (5 or less) for a service showcase
 * @param {File[]} files - Array of image files to upload (max 5 files).
 * @param {string} offeringId - The ID of the service.
 * @returns {Promise<string[]>} - Array of uploaded file URLs.
 */
export const uploadOfferingImageShowcase = async (
  files: File[],
  offeringId: string,
  index?: number,
): Promise<string[]> => {
  if (files.length > 5) {
    throw new Error("You can upload a maximum of 5 images.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("serviceId", offeringId);
  if (typeof index === "number") {
    formData.append("index", index.toString());
  }

  try {
    const response = await request.post("/upload/service-showcase", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.uploadedUrls;
  } catch (error) {
    throw error;
  }
};

export const uploadServiceImageShowcase = uploadOfferingImageShowcase;
