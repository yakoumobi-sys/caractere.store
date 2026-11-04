import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivilegeClient from "./PrivilegeClient";

export const metadata: Metadata = {
  title: "Caractère Privilège — Votre carte de fidélité",
  description: "Retrouvez votre carte Caractère Privilège, vos points et récompenses sur caracteredz.com.",
  alternates: { canonical: "/privilege" },
};

export default function PrivilegePage() {
  return <><Navbar /><PrivilegeClient /><Footer /></>;
}
