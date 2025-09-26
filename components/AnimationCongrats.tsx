// components/AnimationCongrats.tsx
import React, { useRef } from "react";
import Lottie from "lottie-react";
import congratsData from "public/animations/congratulation.json";

export default function AnimationCongrats({ loop = false, style }) {
  const lottieRef = useRef(null);

  return (
    <div style={style ?? { width: 200 }}>
      <Lottie lottieRef={lottieRef} animationData={congratsData} loop={loop} />
    </div>
  );
}
