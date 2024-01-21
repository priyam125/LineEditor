import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  RichUtils,
} from "draft-js";

const LineEditor2 = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = ContentState.createFromText(savedContent);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const saveContentToLocalStorage = () => {
    const content = editorState.getCurrentContent().getPlainText();
    localStorage.setItem("editorContent", content);
  };

  useEffect(() => {
    saveContentToLocalStorage();
  }, [editorState]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const handleReturn = (event) => {
    if (event.shiftKey) {
      return "not-handled";
    }

    setEditorState(RichUtils.insertSoftNewline(editorState));
    return "handled";
  };

  const handleHashDecorator = (contentBlock, callback) => {
    findWithRegex(/^\s*#/, contentBlock, callback);
  };

  const handleBoldDecorator = (contentBlock, callback) => {
    findWithRegex(/^\s*\*/, contentBlock, callback);
  };

  const findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  };

  const compositeDecorator = new CompositeDecorator([
    {
      strategy: handleHashDecorator,
      component: (props) => (
        <span style={{ fontWeight: "bold" }}>{props.children}</span>
      ),
    },
    {
      strategy: handleBoldDecorator,
      component: (props) => (
        <span style={{ fontStyle: "italic" }}>{props.children}</span>
      ),
    },
  ]);

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        handleReturn={handleReturn}
        decorators={compositeDecorator}
      />
      <button onClick={saveContentToLocalStorage}>Save</button>
    </div>
  );
};

export default LineEditor2;
