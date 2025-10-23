import { Fighter } from "@shared/types";
import { apiClient } from "@/service/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useFighter = (id: string | string[] | undefined) =>
  useQuery({
    queryKey: ["fighter", id],
    queryFn: () => apiClient.get<Fighter>(`/fighter/${id}`),
    enabled: !!id,
  });
