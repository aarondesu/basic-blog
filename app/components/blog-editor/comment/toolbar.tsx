import { Toggle } from "~/components/ui/toggle";
import { externalActions } from "../actions";
import { useEditorState, type Editor } from "@tiptap/react";
import { editorStateSelector } from "../state";
import { ToggleGroup } from "~/components/ui/toggle-group";

export default function CommentEditorToolbar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  const editorState = useEditorState({
    editor: editor,
    selector: editorStateSelector,
  });

  return (
    <div className="p-2 border-b">
      <div className="flex justify-end">
        <ToggleGroup type="multiple">
          {externalActions.map((action, index) => (
            <Toggle
              type="button"
              key={index}
              size="sm"
              pressed={action.isActive ? action.isActive(editorState) : false}
              onClick={() => action.onClick(editor)}
            >
              <action.icon />
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
