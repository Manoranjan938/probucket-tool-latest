import React, { Component } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRedo } from "react-icons/fa";

import logo from "shared/assets/images/logo.png";

// Same buttons as the 404 page (shared/pages/Error/Error.tsx)
const btn =
  "inline-flex justify-center items-center gap-2 py-3 px-[22px] border rounded-[10px] [font-family:inherit] text-[16px] font-semibold leading-[1.2] no-underline cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-brand-primary focus-visible:outline-offset-2 motion-reduce:transition-none";
const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8]`;
const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;

// "page" replaces the whole screen; "content" sits in the dashboard content area, so the header and sidebar stay usable
type Variant = "page" | "content";

const Message = ({ variant }: { variant: Variant }) => (
  <div
    className={`flex flex-col items-center w-full max-w-[560px] text-center text-brand-text leading-[1.5] ${
      variant === "page" ? "m-auto py-8" : "mx-auto py-16"
    }`}
    role="alert"
  >
    <span className="mb-3 text-[13px] font-bold tracking-[0.08em] uppercase text-brand-strong">Something went wrong</span>
    <h1
      className={`mb-3 font-extrabold leading-[1.1] tracking-[-0.03em] text-brand-ink ${
        variant === "page" ? "text-[44px] max-[480px]:text-[34px]" : "text-[32px]"
      }`}
    >
      Couldn't load this page
    </h1>
    <p className="max-w-[460px] text-[17px] max-[480px]:text-[16px]">
      Check your internet connection and reload the page. If ProBucket was just
      updated, reloading gets you the latest version.
    </p>
    <div className="flex justify-center gap-3 mt-8 max-[480px]:flex-col max-[480px]:self-stretch">
      <button type="button" className={btnPrimary} onClick={() => window.location.reload()}>
        <FaRedo />
        Reload page
      </button>
      <Link to="/" className={btnGhost}>
        Go to home
      </Link>
    </div>
  </div>
);

interface BoundaryProps {
  children: ReactNode;
  variant: Variant;
  resetKey: string;
}

interface BoundaryState {
  error: Error | null;
}

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: BoundaryProps) {
    // Navigating to another page clears the error
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    if (this.props.variant === "content") {
      return <Message variant="content" />;
    }

    // Same frame as the 404 page
    return (
      <div className="flex flex-col min-h-screen py-8 px-12 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft)_0%,rgba(241,240,252,0)_70%),var(--color-brand-surface)] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border max-[480px]:py-6 max-[480px]:px-4">
        <header>
          <Link to="/" className="inline-flex items-center gap-2 no-underline text-brand-ink">
            <img src={logo} alt="" className="w-[34px] h-[34px]" />
            <span className="text-[22px] font-bold tracking-[-0.01em]">ProBucket</span>
          </Link>
        </header>
        <Message variant="page" />
      </div>
    );
  }
}

// Catches a lazy page whose code failed to download (offline, or an old tab after a new deploy)
// and any other error thrown while rendering the routes below it
const RouteErrorBoundary = ({ children, variant = "page" }: { children: ReactNode; variant?: Variant }) => {
  const { pathname } = useLocation();

  return (
    <Boundary variant={variant} resetKey={pathname}>
      {children}
    </Boundary>
  );
};

export default RouteErrorBoundary;
