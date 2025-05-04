import React from "react";
import AiMarkdown from "./AiMarkdown";

function Typewriter({
  text,
  delay,
  small = false,
  skipAnimation = false,
  setSkipAnimation = () => {},
  setWriting = () => {},
  setChatArray = () => {},
}) {
  const [currentText, setCurrentText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (skipAnimation === "clear") {
      setCurrentText(text);
      setSkipAnimation(false);
    } else if (skipAnimation) {
      setChatArray((prev) => {
        const updated = [...prev];
        updated[0] = { ...prev[0], message: currentText };
        return updated;
      });
      setSkipAnimation(false);
    }
    if (currentIndex < text.length && !skipAnimation) {
      setWriting(true);
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setWriting(false);
    }
  }, [currentIndex, delay, text]);

  if (small) {
    return <AiMarkdown fontSize={11}>{currentText}</AiMarkdown>;
  }
  return <AiMarkdown>{currentText}</AiMarkdown>;
}

export default Typewriter;
