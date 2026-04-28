import request from '../../utils/request';

export type VendorRecommendationRequest = {
  location?: string;
  budget?: number;
  categories?: string[];
  notes?: string;
  limit?: number;
};

export const getVendorRecommendations = async (
  payload: VendorRecommendationRequest,
  accessToken: string,
) => {
  const response = await request.post('/recommendations/vendors', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};
