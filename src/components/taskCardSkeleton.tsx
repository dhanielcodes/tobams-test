import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function TaskCardSkeleton() {
  return (
    <Card className="bg-card text-card-foreground shadow-sm animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
          <div className="w-full bg-muted rounded-full h-2"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded-full w-1/3"></div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-muted rounded-full"></div>
              <div className="h-4 w-4 bg-muted rounded-full"></div>
              <div className="h-6 w-12 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}