"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AppNavbar from "./AppNavbar";

export default function SiteHeader() {
  const pathname = usePathname();
  return pathname === "/" ? <Navbar /> : <AppNavbar />;
}
