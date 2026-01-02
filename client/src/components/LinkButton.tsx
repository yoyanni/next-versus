import Link, { LinkProps } from "next/link";
import React from "react";

interface LinkButtonProps extends LinkProps {
  title: string;
  className?: string;
}

const LinkButton = ({ title, href, className }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`justify-self-center block px-2 py-1 border bg-white rounded-md ${className}`}
    >
      {title}
    </Link>
  );
};

export default LinkButton;
