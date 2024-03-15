"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const navs = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "FAQ",
      href: "/about/faq",
    },
  ];
  return (
    <div className="py-10 text-center">
      <p>Copyright 2024 @ Studio Pinya - Pinya Studio</p>
    </div>
  );
};

export default Footer;
