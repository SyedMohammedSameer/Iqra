import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ 
  className, 
  size = "md", 
  text = "Loading..." 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 p-8",
      className
    )}>
      <div className="relative">
        <Loader2 className={cn(
          "animate-spin text-emerald-600",
          sizeClasses[size]
        )} />
        <div className="absolute inset-0 animate-ping">
          <div className={cn(
            "rounded-full bg-emerald-200 opacity-20",
            sizeClasses[size]
          )} />
        </div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}