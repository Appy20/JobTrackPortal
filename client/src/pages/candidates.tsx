import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Candidate } from "@shared/schema";
import CandidateCard from "@/components/candidate-card";
import SearchFilter from "@/components/search-filter";
import { useState } from "react";

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
    enabled: !searchQuery,
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates/search", searchQuery],
    enabled: !!searchQuery,
    queryFn: async () => {
      const res = await fetch(`/api/candidates/search?q=${searchQuery}`);
      return res.json();
    }
  });

  const displayCandidates = searchQuery ? searchResults : candidates;

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

      {(isLoading || isSearching) ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayCandidates.map((candidate) => (
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