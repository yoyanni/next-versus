import standard from "@/standard";
import { Fighter } from "@shared/types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Fighters() {
  const router = useRouter();
  return <div>{router.query.id}</div>;
}
