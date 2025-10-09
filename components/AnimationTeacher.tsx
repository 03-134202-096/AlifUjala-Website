// components/AnimationTeacher.tsx
import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import teacherData from "public/animations/woman_teacher.json";

export default function AnimationTeacher({ loop = true, style, isPlaying = false }: any) {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={"w-[150px]"} style={style}>
      <Lottie lottieRef={lottieRef} animationData={teacherData} loop={loop} />
    </div>
  );
}
