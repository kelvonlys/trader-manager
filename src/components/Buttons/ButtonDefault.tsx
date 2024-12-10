import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link: string;
  customClasses: string;
  children?: React.ReactNode;
}

const ButtonDefault = ({
  label,
  link,
  customClasses,
  children,
}: ButtonPropTypes) => {
  return (
    <>
      <Link
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium rounded-2xl hover:bg-opacity-80 ${customClasses}`}
        href={link}
      >
        {children}
        {label}
      </Link>
    </>
  );
};

export default ButtonDefault;
