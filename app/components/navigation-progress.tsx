import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";

import { Progress } from "./ui/progress";
import { cn } from "~/lib/utils";

export default function NavigationProgress() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  // Handle progress and visibility
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (navigation.state !== "idle") {
      setVisible(true);
      setProgress(15);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;

          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setProgress(100);

      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => clearInterval(timer);
  }, [navigation.state]);

  return (
    <Progress
      value={progress}
      data-visible={visible}
      className={cn(
        "absolute top-0 left-0",
        "invisible data-[visible=true]:visible opacity-0 data-[visible=true]:opacity-100 ease-in-out transition-opacity duration-500",
      )}
    />
  );
}
