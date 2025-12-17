import Link, { LinkProps } from "next/link";
import React from "react";

interface LinkButtonProps extends LinkProps {
  title: string;
}

const LinkButton = ({ title, href }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className="justify-self-center block px-2 py-1 mt-4 border bg-white rounded-md"
    >
      {title}
    </Link>
  );
};

export default LinkButton;
