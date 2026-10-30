import React from "react";
import { Skeleton } from "@mui/material";

import * as landing from "features/landing/styles/landingClasses";

// Shown while the landing page's code is loading: nav, hero with the board preview, and the Features section
const HomeSkeleton = () => {
  return (
    <div className={landing.page} aria-busy="true">
      {/* LandingNav */}
      <header className="sticky top-0 z-1000 bg-[rgba(255,255,255,0.92)] border-b border-brand-border">
        <div className={`${landing.container} flex items-center gap-8 h-[68px]`}>
          <div className={landing.brand}>
            <Skeleton variant="circular" width={34} height={34} />
            <Skeleton variant="text" width={110} sx={{ fontSize: 22 }} />
          </div>
          <div className="flex flex-1 items-center justify-between max-[768px]:hidden">
            <div className="flex gap-7">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} variant="text" width={80} sx={{ fontSize: 15 }} />
              ))}
            </div>
            <div className="flex items-center gap-5">
              <Skeleton variant="text" width={45} sx={{ fontSize: 15 }} />
              <Skeleton variant="rounded" width={110} height={38} sx={{ borderRadius: "10px" }} />
            </div>
          </div>
          {/* Menu button on small screens */}
          <Skeleton variant="rounded" width={36} height={36} className="hidden! ml-auto max-[768px]:block!" />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-22 pb-24 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft)_0%,rgba(241,240,252,0)_70%),var(--color-brand-surface)] max-[768px]:pt-14 max-[768px]:pb-16">
          <div className={landing.container}>
            <div className="flex flex-col items-center max-w-[760px] mx-auto">
              <Skeleton variant="rounded" width={370} height={34} sx={{ maxWidth: "100%", mb: "24px", borderRadius: "999px" }} />
              <Skeleton variant="text" width="80%" sx={{ fontSize: 56, lineHeight: 1.08 }} />
              <Skeleton variant="text" width="70%" sx={{ fontSize: 56, lineHeight: 1.08, mb: "20px" }} />
              <Skeleton variant="text" width="78%" sx={{ fontSize: 19 }} />
              <Skeleton variant="text" width="78%" sx={{ fontSize: 19 }} />
              <Skeleton variant="text" width="15%" sx={{ fontSize: 19 }} />
              <div className="flex justify-center gap-3 mt-9">
                <Skeleton variant="rounded" width={180} height={44} sx={{ borderRadius: "10px" }} />
                <Skeleton variant="rounded" width={90} height={44} sx={{ borderRadius: "10px" }} />
              </div>
            </div>

            {/* BoardPreview */}
            <div className="max-w-[980px] mt-16 mx-auto border border-brand-border rounded-brand bg-brand-surface overflow-hidden max-[768px]:mt-12">
              <div className="flex items-center gap-1.5 py-3 px-4 border-b border-brand-border bg-brand-surface-alt">
                <Skeleton variant="text" width={120} sx={{ fontSize: 13 }} />
              </div>
              <div className="grid grid-cols-[repeat(3,1fr)] gap-4 p-5 max-[768px]:grid-cols-[1fr] max-[768px]:p-3.5">
                {[0, 1, 2].map((column) => (
                  <div className="flex flex-col gap-2.5 p-3 rounded-[10px] bg-brand-surface-alt" key={column}>
                    <Skeleton variant="text" width="50%" sx={{ fontSize: 13 }} />
                    <Skeleton variant="rounded" height={72} sx={{ borderRadius: "8px" }} />
                    <Skeleton variant="rounded" height={72} sx={{ borderRadius: "8px" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={landing.section}>
          <div className={landing.container}>
            <div className={`${landing.sectionHeader} flex flex-col items-center`}>
              <Skeleton variant="text" width={80} sx={{ fontSize: 13, mb: "12px" }} />
              <Skeleton variant="text" width="80%" sx={{ fontSize: 36, lineHeight: 1.2, mb: "12px" }} />
              <Skeleton variant="text" width="65%" sx={{ fontSize: 18 }} />
            </div>
            <div className="grid grid-cols-[repeat(3,1fr)] gap-6 max-[960px]:grid-cols-[repeat(2,1fr)] max-[640px]:grid-cols-[1fr]">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div className="p-7 border border-brand-border rounded-brand bg-brand-surface" key={item}>
                  <Skeleton variant="rounded" width={44} height={44} sx={{ mb: "18px", borderRadius: "10px" }} />
                  <Skeleton variant="text" width="55%" sx={{ fontSize: 18, mb: "8px" }} />
                  <Skeleton variant="text" width="100%" sx={{ fontSize: 15 }} />
                  <Skeleton variant="text" width="80%" sx={{ fontSize: 15 }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeSkeleton;
