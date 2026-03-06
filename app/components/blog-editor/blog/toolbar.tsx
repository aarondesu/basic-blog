import { Editor, useEditorState } from "@tiptap/react";
import { Button } from "../../ui/button";
import { ButtonGroup } from "../../ui/button-group";

import { Toggle } from "../../ui/toggle";
import { editorStateSelector } from "../state";
import { allActions } from "../actions";

export default function BlogEditorToolbar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor: editor,
    selector: editorStateSelector,
  });

  return (
    <span className="flex flex-wrap gap-2">
      {allActions.map((category, index) => (
        <ButtonGroup key={index}>
          {category.map((button, index) => {
            if (button.isActive) {
              return (
                <Toggle
                  type="button"
                  key={index}
                  variant="outline"
                  size="sm"
                  pressed={
                    button.isActive ? button.isActive(editorState) : false
                  }
                  onClick={() => button.onClick(editor)}
                >
                  <button.icon />
                </Toggle>
              );
            } else {
              return (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => button.onClick(editor)}
                >
                  <button.icon />
                </Button>
              );
            }
          })}
        </ButtonGroup>
      ))}
    </span>
  );
}
