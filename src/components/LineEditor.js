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
import { FaInfoCircle } from "react-icons/fa";

const LineEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const [showKeyBindings, setShowKeyBindings] = useState(false);

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

    if (e.key === " ") {
      const match = contentText.match(/^(\s*)(#|[*]{1,3})(\s*)/);
      if (match) {
        e.preventDefault();

        const [, leadingSpaces, specialChars, trailingSpaces] = match;
        const startOffset = leadingSpaces.length;
        const endOffset = contentText.length - trailingSpaces.length;

        const updatedContentState = Modifier.replaceText(
          content,
          selection.merge({
            anchorOffset: startOffset,
            focusOffset: endOffset,
          }),
          ""
        );

        const newEditorState = EditorState.push(
          editorState,
          updatedContentState,
          "remove-special-chars"
        );

        if (specialChars === "#") {
          onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
        } else if (specialChars === "*") {
          onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
        } else if (specialChars === "**") {
          onChange(
            RichUtils.toggleInlineStyle(newEditorState, "doubleStarColor")
          );
        } else if (specialChars === "***") {
          onChange(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHash);

    return () => {
      document.removeEventListener("keydown", handleHash);
    };
  }, [editorState]);

  const keyBindingsInfo = (
    <div className="absolute top-12 left-4 bg-white p-4 shadow-md rounded-md">
      <p>
        <strong>Key Bindings:</strong>
      </p>
      <p># + Space: Heading</p>
      <p>* + Space: Bold</p>
      <p>** + Space: Red Line</p>
      <p>*** + Space: Underline</p>
    </div>
  );

  return (
    <div className="relative flex flex-col">
      <div className="flex justify-between space-x-20 mb-2">
        <span
          className="ml-2 cursor-pointer z-10"
          onMouseEnter={() => setShowKeyBindings(true)}
          onMouseLeave={() => setShowKeyBindings(false)}
        >
          <FaInfoCircle />
          {showKeyBindings && keyBindingsInfo}
        </span>

        <h1>Line editor by Priyam</h1>
        <button
          onClick={handleSave}
          className="border-[3px] border-black py-0.5 px-3 border-b-4 border-r-4"
        >
          Save
        </button>
      </div>
      <div className="border-2 border-blue-400 p-4">
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={colorStyleMap}
          placeholder="Type here..."
        />
      </div>
    </div>
  );
};

export default LineEditor;
