import type { Problem } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProblemModalProps {
  problem: Problem | null;
  onClose: () => void;
}

export default function ProblemModal({ problem, onClose }: ProblemModalProps) {
  const renderStars = (count: number) => {
    return "★".repeat(Math.max(0, count));
  };

  return (
    <Dialog open={!!problem} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        {problem && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{problem.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Difficulty:</span>
                <span className="text-yellow-500">
                  {renderStars(problem.difficulty || 0)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Grade:</span>
                <Badge variant="secondary">{problem.grade}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Setter:</span>
                <span className="text-sm">{problem.setter}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-yellow-500">
                  {renderStars(problem.rating || 0)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
