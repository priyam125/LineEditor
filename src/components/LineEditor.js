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
    } else if (command === "toggle-underline") {
      onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return "handled";
    } else if (command === "toggle-double-star-color") {
      console.log("entered");
      onChange(RichUtils.toggleInlineStyle(editorState, "doubleStarColor"));
      return "handled";
    }
    return "not-handled";
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
  };

  const colorStyleMap = {
    // ... other color styles
    doubleStarColor: {
      color: "red", // Set your desired color
    },
  };

  const handleHash = (e) => {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = content.getBlockForKey(selection.getStartKey());
    const contentText = currentBlock.getText().trimStart();
    const startsWithHash = contentText.startsWith("#");
    const startsWithStar = contentText.startsWith("*");
    const startsWithTwoStar = contentText.startsWith("**");
    const startsWithThreeStar = contentText.startsWith("***");

    console.log("e.key", e.key);
    console.log("startsWithHash", startsWithHash);
    console.log("contentText.length", contentText.length);
    console.log("startsWithHash.length + 1", startsWithHash.length + 1);

    if (e.key === " " && startsWithHash && contentText.length === 1) {
      console.log("entered");
      e.preventDefault();
      handleKeyCommand("toggle-heading");
    } else if (e.key === " " && startsWithStar && contentText.length === 1) {
      console.log("entered");
      e.preventDefault();
      handleKeyCommand("toggle-bold");
    } else if (e.key === " " && startsWithTwoStar && contentText.length === 2) {
      console.log("2 entered 2");
      e.preventDefault();
      handleKeyCommand("toggle-double-star-color");
    } else if (
      e.key === " " &&
      startsWithThreeStar &&
      contentText.length === 3
    ) {
      console.log("entered");
      e.preventDefault();
      handleKeyCommand("toggle-underline");
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
        customStyleMap={colorStyleMap}
        placeholder="Type here..."
      />
    </div>
  );
};

export default LineEditor;
