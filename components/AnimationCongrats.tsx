// components/AnimationCongrats.tsx
import React, { useRef } from "react";
import Lottie from "lottie-react";
import congratsData from "public/animations/congratulation.json";

export default function AnimationCongrats({ loop = false, style }: any) {
  const lottieRef = useRef(null)

  return (
    <div className={"w-[200px]"} style={style}>
      <Lottie lottieRef={lottieRef} animationData={congratsData} loop={loop} />
    </div>
  )
}
