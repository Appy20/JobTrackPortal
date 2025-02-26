import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FileText } from "lucide-react";
import type { Candidate } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PdfViewer from "@/components/pdf-viewer";

interface CandidateCardProps {
  candidate: Candidate;
  onStatusChange: (id: number, status: string) => void;
}

const statusColors = {
  new: "bg-blue-500",
  reviewing: "bg-yellow-500",
  interviewed: "bg-purple-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
};

export default function CandidateCard({ candidate, onStatusChange }: CandidateCardProps) {
  const [showResume, setShowResume] = useState(false);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">
                {candidate.experience} years experience
              </p>
            </div>
            <Badge variant="secondary">{candidate.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{candidate.phone}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <select
            className="bg-background border rounded p-1"
            value={candidate.status}
            onChange={(e) => onStatusChange(candidate.id, e.target.value)}
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="interviewed">Interviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          {candidate.resumePath && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResume(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Resume
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showResume} onOpenChange={setShowResume}>
        <DialogContent className="max-w-4xl h-[80vh]">
          {showResume && candidate.resumePath && (
            <PdfViewer pdfPath={candidate.resumePath} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}