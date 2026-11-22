import React from "react";

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={`max-w-4xl px-4 m-auto ${className}`}>{children}</section>
  );
};

export default Container;
