export const BLACK = "#000000";
export const GREEN = "#C5DAC1";
export const GREY = "#474747";
export const LIGHT_GREY = "#707070";
export const RED = "a50104";
export const WHITE = "#ffffff";

export const CHAT_USER_COLOR = WHITE;
export const CHAT_AI_COLOR = WHITE;

export function customScrollBar(color = LIGHT_GREY) {
  return {
    "&::-webkit-scrollbar": {
      width: "0.4em",
      height: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      width: "0.6em",
      height: "0.6em",
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: color,
      borderRadius: 20,
    },
  };
}

export const containers = {
  CONVERSATION: "Conversations",
};
