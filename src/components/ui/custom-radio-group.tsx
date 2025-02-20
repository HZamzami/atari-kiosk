"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleCheck } from "lucide-react";

import { Label } from "./label";

import { cn } from "@/lib/utils";

const CustomRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
CustomRadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const CustomRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    label: string;
    fieldName?: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, label, fieldName, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "bg-card bg-[#fafbfd] text-card-foreground focus-visible:ring-ring flex h-[50px] items-center justify-between rounded-lg border p-4 shadow-sm hover:ring-1 hover:ring-inset hover:ring-[#0077B6] focus:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:ring-1 data-[state=checked]:ring-inset data-[state=checked]:ring-[#0077B6]",
        className
      )}
      {...props}
    >
      <Label htmlFor={fieldName ?? ""}>{label}</Label>

      <div className="flex size-[24px] items-center justify-center rounded-full border border-[#C3C3C3]">
        <RadioGroupPrimitive.RadioGroupIndicator>
          <CircleCheck color="#0077B6" className="size-[26px]" />
        </RadioGroupPrimitive.RadioGroupIndicator>
      </div>
    </RadioGroupPrimitive.Item>
  );
});
CustomRadioGroupItem.displayName =
  RadioGroupPrimitive.Item.displayName;

export { CustomRadioGroup, CustomRadioGroupItem };
