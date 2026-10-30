import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import logo from "shared/assets/images/logo.png";
import image from "shared/assets/images/error-page.png";

// Same palette and button shape as the landing page
const btn =
  "inline-flex justify-center items-center gap-2 py-3 px-[22px] border rounded-[10px] [font-family:inherit] text-[16px] font-semibold leading-[1.2] no-underline cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-brand-primary focus-visible:outline-offset-2 motion-reduce:transition-none";
const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8]`;
const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;

// Shown for any URL that no route matches
const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen py-8 px-12 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft)_0%,rgba(241,240,252,0)_70%),var(--color-brand-surface)] text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border max-[480px]:py-6 max-[480px]:px-4">
      <header>
        <Link to="/" className="inline-flex items-center gap-2 no-underline text-brand-ink">
          <img src={logo} alt="" className="w-[34px] h-[34px]" />
          <span className="text-[22px] font-bold tracking-[-0.01em]">ProBucket</span>
        </Link>
      </header>

      <main className="flex flex-col items-center w-full max-w-[560px] m-auto py-8 text-center">
        <img className="w-full max-w-[360px] h-auto mb-6 mix-blend-multiply" src={image} alt="" />
        <span className="mb-3 text-[13px] font-bold tracking-[0.08em] uppercase text-brand-strong">404 error</span>
        <h1 className="mb-3 text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] text-brand-ink max-[480px]:text-[34px]">Page not found</h1>
        <p className="max-w-[460px] text-[17px] max-[480px]:text-[16px]">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, renamed or never existed.
        </p>
        <div className="flex justify-center gap-3 mt-8 max-[480px]:flex-col max-[480px]:self-stretch">
          <Link to="/" className={btnPrimary}>
            Go to home
          </Link>
          <button type="button" className={btnGhost} onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Go back
          </button>
        </div>
      </main>
    </div>
  );
};

export default Error;
