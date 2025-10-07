// components/AnimationTeacher.tsx
import React, { useRef } from "react";
import Lottie from "lottie-react";
import teacherData from "public/animations/woman_teacher.json";

type AnimationTeacherProps = {
  loop?: boolean;
  style?: React.CSSProperties;
  play?: boolean;
};

export default function AnimationTeacher({ loop = true, style, play = true }: AnimationTeacherProps) {
  const lottieRef = useRef<any>(null);

  React.useEffect(() => {
    if (play) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [play]);

  return (
    <div className={"w-[150px]"} style={style}>
      <Lottie lottieRef={lottieRef} animationData={teacherData} loop={loop} />
    </div>
  );
}
