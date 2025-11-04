import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState, useRef } from "react";
import "./editor.css";

export default function EditorCore() {
  const [content, setContent] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // ✅ Load saved content from localStorage on mount
  useEffect(() => {
    if ("localStorage" in window) return;
    const saved = localStorage.getItem("editor") || "";
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  // ✅ Save to localStorage whenever content changes (with a small delay)
  useEffect(() => {
    if (!content) return;
    const timeout = setTimeout(() => {
      localStorage.setItem("editor", JSON.stringify(content));
    }, 1000); // debounce to avoid saving too often
    return () => clearTimeout(timeout);
  }, [content]);

  return (
    <div className="container">
      <Editor
        apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={content} // ✅ controlled input
        onEditorChange={(newValue) => setContent(newValue)} // ✅ correct change handler
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          statusbar: true, // show wordcount plugin
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}
