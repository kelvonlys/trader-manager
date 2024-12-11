import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link?: string;
  customClasses: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ButtonDefault: React.FC<ButtonPropTypes> = ({
  label,
  link,
  customClasses,
  onClick,
  children,
}) => {
  if (link) {
    return (
      <Link
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium rounded-2xl hover:bg-opacity-80 ${customClasses}`}
        href={link}
      >
        {children}
        {label}
      </Link>
    );
  } else {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium rounded-2xl hover:bg-opacity-80 ${customClasses}`}
        onClick={onClick}
      >
        {children}
        {label}
      </button>
    );
  }
};

export default ButtonDefault;
