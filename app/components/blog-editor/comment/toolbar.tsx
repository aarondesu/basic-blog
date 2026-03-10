import { Toggle } from "~/components/ui/toggle";
import { externalActions, textFormatActions } from "../actions";
import { useEditorState, type Editor } from "@tiptap/react";
import { editorStateSelector } from "../state";
import { ToggleGroup } from "~/components/ui/toggle-group";

const actions = [textFormatActions, externalActions];

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
    <div className="p-2 border-b bg-muted/50">
      <div className="flex gap-2">
        {actions.map((category, index) => (
          <ToggleGroup type="multiple" key={index}>
            {category.map((action, index) => (
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
        ))}
      </div>
    </div>
  );
}
