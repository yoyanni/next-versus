import { Fighter } from "@shared/types";
import { apiClient } from "@/service/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useFighters = () =>
  useQuery({
    queryKey: ["fighters"],
    queryFn: () => apiClient.get<Fighter[]>("/fighters"),
    staleTime: 1000 * 60 * 5,
  });
