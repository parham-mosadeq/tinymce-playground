import { Editor } from "@tinymce/tinymce-react";
import "./editor.css";

export default function EditorCore() {
  return (
    <div className="container">
      <Editor
        apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
        // onInit={(evt, editor) => {}}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
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
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}
