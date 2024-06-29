import { useMutation, useQuery, useQueryClient } from "react-query";
import { mediaReviewSchema } from "shared/validations/mediaReviewSchema";
import { z } from "zod";

export const QUERY_KEY = "mediaReviews";

const fetchAllMediaReviews = async () => {
  const apiUrl = new URL(
    `/mediareviews`,
    process.env.NEXT_PUBLIC_ASHWINGUR_API
  ).toString();

  const response = await fetch(apiUrl, {
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  const responseSchema = z.array(mediaReviewSchema);

  const result = responseSchema.safeParse(responseData);

  if (!result.success) {
    throw new Error(`Error ${response.status}: Invalid response format`);
  }

  return result.data;
};

const deleteMediaReview = async (id: number) => {
  const errorSchema = z.object({
    error: z.string().optional(),
  });

  const apiUrl = new URL(
    `/mediareviews/${id}`,
    process.env.NEXT_PUBLIC_ASHWINGUR_API
  ).toString();

  const response = await fetch(apiUrl, {
    method: "DELETE",
    credentials: "include",
  });

  let responseData;

  try {
    responseData = await response.json();
  } catch (error) {
    throw new Error(`Error ${response.status}`);
  }

  if (!response.ok) {
    const result = errorSchema.safeParse(responseData);
    if (result.success && result.data.error) {
      throw new Error(`Error ${response.status}: ${result.data.error}`);
    } else {
      throw new Error(`Error ${response.status}: Unknown error`);
    }
  }
};

export const useDeleteMediaReview = () => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => deleteMediaReview(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
    },
  });
};

export const useMediaReviews = () => {
  return useQuery(QUERY_KEY, fetchAllMediaReviews);
};
