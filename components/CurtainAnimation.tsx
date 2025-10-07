import React, { useRef, useImperativeHandle, forwardRef } from "react";
import Lottie from "lottie-react";
import curtainData from "public/animations/curtain opening.json";

type CurtainAnimationProps = {
  loop?: boolean;
  style?: React.CSSProperties;
  play?: boolean;
};

const CurtainAnimation = forwardRef<any, CurtainAnimationProps>(({ loop = false, style, play = false }, ref) => {
  const lottieRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      lottieRef.current?.play();
    },
    stop: () => {
      lottieRef.current?.stop();
    },
    goToAndStop: (frame: number) => {
      lottieRef.current?.goToAndStop(frame, true);
    }
  }));

  React.useEffect(() => {
    if (play) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [play]);

  return (
    <div style={style}>
      <Lottie lottieRef={lottieRef} animationData={curtainData} loop={loop} />
    </div>
  );
});

export default CurtainAnimation;
