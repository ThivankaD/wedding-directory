import request from "@/utils/request";

/**
 * Upload multiple videos for a service video showcase
 * @param {File[]} files - Array of video files to upload.
 * @param {string} offeringId - The ID of the service.
 * @returns {Promise<string[]>} - Array of uploaded video URLs.
 */
export const uploadOfferingVideoShowcase = async (
  files: File[],
  offeringId: string,
): Promise<string[]> => {
  if (files.length === 0) {
    throw new Error("You need to upload at least one video.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("serviceId", offeringId);

  try {
    const response = await request.post("/upload/service-videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.uploadedUrls;
  } catch (error) {
    if (error instanceof Error) {
      //console.error("Error uploading videos:", error.message);
    } else {
      //console.error("Error uploading videos:", error);
    }
    throw error;
  }
};

export const uploadServiceVideoShowcase = uploadOfferingVideoShowcase;
