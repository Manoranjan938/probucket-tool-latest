import React from "react";

const badge =
  "inline-flex shrink-0 items-center self-start px-2 py-0.5 rounded-full bg-brand-surface-alt border border-brand-border text-[12px] font-semibold text-brand-muted whitespace-nowrap";

// Marks a part of a page whose backend isn't built yet – each feature lists that work in its BACKEND_TODO.md
const ComingSoonBadge = ({ label = "Coming soon" }: { label?: string }) => {
  return <span className={badge}>{label}</span>;
};

export default ComingSoonBadge;
