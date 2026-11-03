import React from "react";

import * as profile from "features/profile/styles/profileClasses";

// Marks a part of the page whose backend isn't built yet – see features/profile/BACKEND_TODO.md
const ComingSoonBadge = ({ label = "Coming soon" }: { label?: string }) => {
  return <span className={profile.comingSoonBadge}>{label}</span>;
};

export default ComingSoonBadge;
