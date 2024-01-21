import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const LineEditor2 = () => {
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
    const contentText = currentBlock.getText();
    const trimmedText = contentText.trimStart();
    const startsWithHash = trimmedText.startsWith("#");
    const startsWithStar = trimmedText.startsWith("*");
    const startsWithTwoStar = trimmedText.startsWith("**");
    const startsWithThreeStar = trimmedText.startsWith("***");

    if (e.key === " " && startsWithHash && trimmedText.length === 1) {
      e.preventDefault();
      const updatedContentState = Modifier.replaceText(
        content,
        selection.merge({
          anchorOffset: contentText.length - trimmedText.length,
          focusOffset: contentText.length,
        }),
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "remove-hash"
      );
      onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
    } else if (e.key === " " && startsWithStar && trimmedText.length === 1) {
      e.preventDefault();
      const updatedContentState = Modifier.replaceText(
        content,
        selection.merge({
          anchorOffset: contentText.length - trimmedText.length,
          focusOffset: contentText.length,
        }),
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "remove-star"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
    } else if (e.key === " " && startsWithTwoStar && trimmedText.length === 2) {
      e.preventDefault();
      const updatedContentState = Modifier.replaceText(
        content,
        selection.merge({
          anchorOffset: contentText.length - trimmedText.length,
          focusOffset: contentText.length,
        }),
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "remove-two-stars"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "doubleStarColor"));
    } else if (
      e.key === " " &&
      startsWithThreeStar &&
      trimmedText.length === 3
    ) {
      e.preventDefault();
      const updatedContentState = Modifier.replaceText(
        content,
        selection.merge({
          anchorOffset: contentText.length - trimmedText.length,
          focusOffset: contentText.length,
        }),
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "remove-three-stars"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHash);

    return () => {
      document.removeEventListener("keydown", handleHash);
    };
  }, [editorState]);

  return (
    <div className="">
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

export default LineEditor2;
