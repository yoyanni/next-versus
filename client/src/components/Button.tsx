import Link, { LinkProps } from "next/link";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const Button = ({ title, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="justify-self-center block px-2 py-1 border bg-white rounded-md"
    >
      {title}
    </button>
  );
};

export default Button;
