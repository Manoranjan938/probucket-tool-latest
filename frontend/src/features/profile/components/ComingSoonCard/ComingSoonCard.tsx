import React from "react";
import type { IconType } from "react-icons";

import * as profile from "features/profile/styles/profileClasses";

import ComingSoonBadge from "shared/components/ComingSoonBadge/ComingSoonBadge";

interface ComingSoonCardProps {
  icon: IconType;
  title: string;
  text: string;
}

// A small card for a feature that isn't available yet
const ComingSoonCard = ({ icon: Icon, title, text }: ComingSoonCardProps) => {
  return (
    <section className={profile.comingSoonCard}>
      <span className={profile.comingSoonIcon} aria-hidden="true">
        <Icon />
      </span>
      <h2 className={profile.cardTitle}>{title}</h2>
      <p className={profile.cardText}>{text}</p>
      <ComingSoonBadge />
    </section>
  );
};

export default ComingSoonCard;
