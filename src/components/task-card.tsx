import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoreHorizontal, MessageCircle, Paperclip } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  progressText: string;
  date: string;
  comments: number;
  attachments: number;
  avatars: string[];
  color: "orange" | "green" | "red";
}

const getProgressColor = (color: string) => {
  switch (color) {
    case "orange":
      return "#ffa048";
    case "green":
      return "#78d700";
    case "red":
      return "#ff7979";
    default:
      return "#888da7";
  }
};

export function TaskCard({
  id,
  title,
  description,
  progress,
  progressText,
  date,
  comments,
  attachments,
  avatars,
  color,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 rotate-3 scale-105" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-accent rounded-full w-8 h-8"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{progressText}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: getProgressColor(color),
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{date}</span>
            <div className="flex items-center gap-3">
              {comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {comments}
                  </span>
                </div>
              )}
              {attachments > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {attachments}
                  </span>
                </div>
              )}
              {avatars.length > 0 && (
                <div className="flex -space-x-2">
                  {avatars.slice(0, 2).map((avatar, index) => (
                    <Avatar
                      key={index}
                      className="w-6 h-6 border-2 border-background"
                    >
                      <AvatarImage src={avatar || "/placeholder.svg"} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ))}
                  {avatars.length > 2 && (
                    <div className="w-6 h-6 bg-muted-foreground rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-background">
                        +{avatars.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
