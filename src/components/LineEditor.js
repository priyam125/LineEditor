import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const LineEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command) => {
    if (command === "toggle-heading") {
      console.log("entered");
      onChange(RichUtils.toggleBlockType(editorState, "header-one"));
      return "handled";
    } else if (command === "toggle-bold") {
      onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
      return "handled";
    } else if (command === "toggle-red-line") {
      onChange(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
      return "handled";
    } else if (command === "toggle-underline") {
      onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return "handled";
    }
    return "not-handled";
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
  };

  const handleHash = (e) => {
    if (e.key === "#" && editorState.getSelection().getStartOffset() === 0) {
      console.log("entered");
      e.preventDefault();
      handleKeyCommand("toggle-heading");
    } else if (
      e.key === "*" &&
      editorState.getSelection().getStartOffset() === 0
    ) {
      console.log("entered");
      e.preventDefault();
      handleKeyCommand("toggle-bold");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHash);

    return () => {
      document.removeEventListener("keydown", handleHash);
    };
  }, [editorState]);

  return (
    <div className="w-80 h-80 bg-blue-200">
      <h1>Title</h1>
      <button onClick={handleSave}>Save</button>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Type here..."
      />
    </div>
  );
};

export default LineEditor;
