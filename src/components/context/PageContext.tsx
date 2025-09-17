"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type PageContextType = {
  slug: string;
  setSlug: (slug: string) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [slug, setSlug] = useState<string>("");

  return (
    <PageContext.Provider value={{ slug, setSlug }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used inside PageProvider");
  }
  return context;
};
