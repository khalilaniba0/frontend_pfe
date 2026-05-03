import React from "react";
import heroIllustration from "assets/a3.png";

export default function AuthHero({ title, subtitle, customImage }) {
  const image = customImage || heroIllustration;

  return (
    <div
      className="relative hidden min-h-[520px] flex-1 overflow-hidden md:flex"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `url(${image})`,
        backgroundSize: "95%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        fontFamily: "var(--font-display)",
      }}
    >
    </div>
  );
}
