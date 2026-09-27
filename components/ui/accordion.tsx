"use client";
import * as Primitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
export const Accordion = Primitive.Root;
export function AccordionItem({
  title,
  children,
  value,
}: {
  title: string;
  children: React.ReactNode;
  value: string;
}) {
  return (
    <Primitive.Item value={value} className="accordion-item">
      <Primitive.Header>
        <Primitive.Trigger>
          {title}
          <Plus size={18} />
        </Primitive.Trigger>
      </Primitive.Header>
      <Primitive.Content>{children}</Primitive.Content>
    </Primitive.Item>
  );
}
