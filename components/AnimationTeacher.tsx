// components/AnimationTeacher.tsx
import React, { useRef } from "react";
import Lottie from "lottie-react";
import teacherData from "public/animations/woman_teacher.json";

export default function AnimationTeacher({ loop = true, style }: any) {
  const lottieRef = useRef(null)

  return (
    <div className={"w-[150px]"} style={style}>
      <Lottie lottieRef={lottieRef} animationData={teacherData} loop={loop} />
    </div>
  )
}
