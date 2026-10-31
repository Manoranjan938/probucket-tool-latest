import React from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

// Centered card for a page with nothing to show (same look as the empty states on the redesigned dashboard pages)
const card =
  "flex flex-col items-center max-w-[460px] mx-auto mt-[6vh] p-10 border border-brand-border rounded-2xl bg-brand-surface text-center text-brand-text leading-[1.5] shadow-brand max-[480px]:px-5 max-[480px]:py-8 [&_*]:box-border";
const iconClass =
  "flex items-center justify-center w-16 h-16 mb-5 rounded-[50%] bg-brand-soft text-[26px] text-brand-strong";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  text: string;
  /** Optional button or link below the text */
  action?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, text, action }: EmptyStateProps) => {
  return (
    <div className={card}>
      <span className={iconClass} aria-hidden="true">
        <Icon />
      </span>
      <h2 className="mb-2 text-[20px] font-bold text-brand-ink">{title}</h2>
      <p className={action ? "mb-6 text-[15px]" : "text-[15px]"}>{text}</p>
      {action}
    </div>
  );
};

export default EmptyState;
