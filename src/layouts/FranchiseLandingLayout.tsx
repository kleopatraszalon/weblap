import React from "react";

export function FranchiseLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      {children}
    </div>
  );
}

export default FranchiseLandingLayout;
