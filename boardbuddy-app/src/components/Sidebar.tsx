import AngleSelector from "./AngleSelector";
import type { Climb } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getGradeForAngle } from "../types";
import { ChevronLeft } from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

interface SidebarProps {
  boardName: string;
  climbs: Climb[];
  selectedClimb: Climb | null;
  onClimbSelect: (climb: Climb) => void;
  onBackClick: () => void;
  angle: number;
  onAngleChange: (angle: number) => void;
  currentPage: number;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  pageLoading: boolean;
}

export default function Sidebar({
  boardName,
  climbs,
  selectedClimb,
  onClimbSelect,
  onBackClick,
  angle,
  onAngleChange,
  currentPage,
  hasNextPage,
  onNextPage,
  onPreviousPage,
  pageLoading,
}: SidebarProps) {
  return (
    <SidebarPrimitive variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Button variant="ghost" onClick={onBackClick} className="justify-start">
          <ChevronLeft className="w-4 h-4 mr-2" />
          <span>Back to Boards</span>
        </Button>
        <div className="px-2">
          <h2 className="text-xl truncate">{boardName}</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 p-2">
              <AngleSelector angle={angle} onAngleChange={onAngleChange} />
              <Select
                value={selectedClimb?.uuid || ""}
                onValueChange={(value) => {
                  const selected = climbs.find((c) => c.uuid === value);
                  if (selected) {
                    onClimbSelect(selected);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a problem" />
                </SelectTrigger>
                <SelectContent>
                  {climbs.map((climb) => (
                    <SelectItem key={climb.uuid} value={climb.uuid}>
                      {climb.climb_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Problems</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 p-2">
              {climbs.map((climb) => (
                <Card
                  key={climb.uuid}
                  className={`cursor-pointer transition-colors ${
                    selectedClimb?.uuid === climb.uuid
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onClimbSelect(climb)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {climb.climb_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Grade:
                      </span>
                      <Badge variant="secondary">
                        {getGradeForAngle(climb, angle)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Setter: {climb.setter_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ascends: {climb.ascends}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={currentPage === 1 || pageLoading}
                  className="flex-1"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {pageLoading ? "Loading..." : `Page ${currentPage}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={!hasNextPage || pageLoading}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}
