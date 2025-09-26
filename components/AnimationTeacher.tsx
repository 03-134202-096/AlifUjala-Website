// components/AnimationTeacher.tsx
import React, { useRef } from "react";
import Lottie from "lottie-react";
import teacherData from "public/animations/woman_teacher.json";

export default function AnimationTeacher({ loop = true, style }) {
  const lottieRef = useRef(null);

  return (
    <div style={style ?? { width: 150 }}>
      <Lottie lottieRef={lottieRef} animationData={teacherData} loop={loop} />
    </div>
  );
}
