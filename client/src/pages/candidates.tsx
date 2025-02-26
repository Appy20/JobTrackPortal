import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Candidate } from "@shared/schema";
import CandidateCard from "@/components/candidate-card";
import SearchFilter from "@/components/search-filter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: candidates, isLoading } = useQuery<Candidate[]>({
    queryKey: [searchQuery ? "/api/candidates/search" : "/api/candidates", searchQuery],
    queryFn: async ({ queryKey }) => {
      if (searchQuery) {
        const res = await fetch(`/api/candidates/search?q=${searchQuery}`);
        return res.json();
      }
      return queryKey[0];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/candidates/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <SearchFilter onSearch={setSearchQuery} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates?.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
