import { Box } from "@mui/material";
import "katex/dist/katex.min.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default function AiMarkdown({ children, fontSize = 14 }) {
  return (
    <Box
      sx={{
        fontFamily: "Roboto !important",
        fontSize: { xs: 12, md: fontSize },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: "#00000055",
              }}
            >
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong
              style={{
                letterSpacing: 0.75,
                fontWeight: "bold",
              }}
            >
              {children}
            </strong>
          ),
          p: ({ children }) => (
            <p style={{ padding: "1px 0px", margin: 0 }}>{children}</p>
          ),
        }}
      >
        {
          children
            .replace(/\\\[([\s\S]+?)\\\]/g, "$$\n$1\n$$") // Block-Math \[ ... \] → $$ ... $$
            .replace(/\\\((.+?)\\\)/g, "$$1$") // Inline-Math \( ... \) → $ ... $
        }
      </ReactMarkdown>
    </Box>
  );
}
