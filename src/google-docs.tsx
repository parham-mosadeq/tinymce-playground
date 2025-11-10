import { useEffect, useRef } from "react";

export default function CanvasEditorMultiline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<string>(""); // stores whole text including newlines
  const cursorPosRef = useRef<number>(0);
  const needsRenderRef = useRef<boolean>(true);

  const LINE_HEIGHT = 24;
  const PADDING_X = 10;
  const PADDING_Y = 10;
  const FONT = "20px monospace";

  // Draw text and cursor
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#000";

    const text = textRef.current;
    const lines = text.split("\n");

    let cursorLine = 0;
    let cursorCol = 0;
    let charsSeen = 0;

    // Figure out which line the cursor is in
    for (let i = 0; i < lines.length; i++) {
      if (cursorPosRef.current <= charsSeen + lines[i].length) {
        cursorLine = i;
        cursorCol = cursorPosRef.current - charsSeen;
        break;
      }
      charsSeen += lines[i].length + 1; // +1 for newline
    }

    // Draw all lines
    lines.forEach((line, i) => {
      ctx.fillText(line, PADDING_X, PADDING_Y + i * LINE_HEIGHT);
    });

    // Draw cursor
    const currentLine = lines[cursorLine] || "";
    const textBeforeCursor = currentLine.slice(0, cursorCol);
    const cursorX = PADDING_X + ctx.measureText(textBeforeCursor).width;
    const cursorY = PADDING_Y + cursorLine * LINE_HEIGHT;

    ctx.fillRect(cursorX, cursorY, 2, 20);
  };

  // Render loop
  useEffect(() => {
    let animationFrame: number;
    const loop = () => {
      if (needsRenderRef.current) {
        render();
        needsRenderRef.current = false;
      }
      animationFrame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let text = textRef.current;
      let cursor = cursorPosRef.current;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        text = text.slice(0, cursor) + e.key + text.slice(cursor);
        cursor++;
        e.preventDefault();
      } else if (e.key === "Backspace") {
        if (cursor > 0) {
          text = text.slice(0, cursor - 1) + text.slice(cursor);
          cursor--;
        }
        e.preventDefault();
      } else if (e.key === "Enter") {
        text = text.slice(0, cursor) + "\n" + text.slice(cursor);
        cursor++;
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        cursor = Math.max(0, cursor - 1);
      } else if (e.key === "ArrowRight") {
        cursor = Math.min(text.length, cursor + 1);
      }

      textRef.current = text;
      cursorPosRef.current = cursor;
      needsRenderRef.current = true;
    };

    const canvas = canvasRef.current;
    canvas?.setAttribute("tabindex", "0"); // Make it focusable
    canvas?.addEventListener("keydown", handleKeyDown);
    canvas?.addEventListener("click", () => canvas.focus());

    return () => {
      canvas?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      style={{
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "text",
        display: "block",
      }}
    />
  );
}
