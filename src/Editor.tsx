/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import "./editor.css";

export default function EditorCore() {
  const [content, setContent] = useState<string>("");
  const editorRef = useRef<any>(null);

  // Load saved content
  useEffect(() => {
    const saved = localStorage.getItem("editor");
    if (saved) setContent(JSON.parse(saved));
  }, []);

  // Save content to localStorage
  useEffect(() => {
    if (!content) return;
    const timeout = setTimeout(() => {
      localStorage.setItem("editor", JSON.stringify(content));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;

    // Register custom plugin with modal input
    editor.ui.registry.addButton("paddingPlugin", {
      text: "Padding",
      tooltip: "Set content padding",
      onAction: () => {
        editor.windowManager.open({
          title: "Set Content Padding",
          body: {
            type: "panel",
            items: [
              {
                type: "input",
                name: "padding",
                label: "Padding (e.g., 10px, 1em, 5%)",
              },
            ],
          },
          buttons: [
            {
              type: "cancel",
              text: "Cancel",
            },
            {
              type: "submit",
              text: "Apply",
              primary: true,
            },
          ],
          onSubmit: (api) => {
            const data = api.getData();
            editor.getBody().style.padding = data.padding;
            editor.notificationManager.open({
              text: `Padding set to ${data.padding}`,
              type: "info",
              timeout: 1500,
            });
            api.close();
          },
        });
      },
    });

    // Menu item (optional, same behavior)
    editor.ui.registry.addMenuItem("paddingPlugin", {
      text: "Set Padding",
      onAction: () => {
        editor.execCommand("mceTogglePaddingDialog");
      },
    });

    // Optional: register a command for menu item
    editor.addCommand("mceTogglePaddingDialog", () => {
      editor.windowManager.open({
        title: "Set Content Padding",
        body: {
          type: "panel",
          items: [
            {
              type: "input",
              name: "padding",
              label: "Padding (e.g., 10px, 1em, 5%)",
            },
          ],
        },
        buttons: [
          { type: "cancel", text: "Cancel" },
          { type: "submit", text: "Apply", primary: true },
        ],
        onSubmit: (api) => {
          const data = api.getData();
          editor.getBody().style.padding = data.padding;
          editor.notificationManager.open({
            text: `Padding set to ${data.padding}`,
            type: "info",
            timeout: 1500,
          });
          api.close();
        },
      });
    });
  };

  return (
    <div className="container">
      <Editor
        apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
        onInit={handleEditorInit}
        value={content}
        onEditorChange={(newValue) => setContent(newValue)}
        init={{
          height: 500,
          menubar: true,
          plugins:
            "advlist autolink lists link image charmap print preview anchor " +
            "searchreplace visualblocks code fullscreen " +
            "insertdatetime media table paste code hel p wordcount",
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "paddingPlugin | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; transition: padding 0.3s ease; }",
        }}
      />
    </div>
  );
}
