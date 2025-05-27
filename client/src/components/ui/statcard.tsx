import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Vote, User, Calendar, Check } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number | bigint;
  subValue?: string;
  icon: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subValue,
  icon,
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  // Helper function to render the appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case "how_to_vote":
        return <Vote className={iconColor} size={24} />;
      case "person":
        return <User className={iconColor} size={24} />;
      case "how_to_reg":
        return <Check className={iconColor} size={24} />;
      case "event_busy":
        return <Calendar className={iconColor} size={24} />;
      default:
        return <Vote className={iconColor} size={24} />;
    }
  };
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className='p-4 border-b border-neutral-200'>
        <h3 className='text-[hsl(var(--neutral-300))] text-sm font-medium uppercase tracking-wider'>
          {title}
        </h3>
      </div>
      <div className='p-6 flex items-center'>
        {renderIcon()}
        <div>
          <p className='font-bold text-xl'>
            {typeof value === "bigint" ? Number(value) : value}
          </p>
          {subValue && (
            <p className='text-sm text-[hsl(var(--neutral-300))]'>{subValue}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
