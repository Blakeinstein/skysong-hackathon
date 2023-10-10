import { Icon } from "@iconify/react";
import Link from "next/link";

export default function DashLink() {
  return <Link className="btn btn-sm" href="/">
    <Icon icon="icon-park-outline:back" className="w-4 h-4"/>
    Dashboard
  </Link>
}