import React, { useCallback, useMemo, useRef, useState } from "react";
import { EditorState, RichUtils } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import editorStyles from "./RichEditor.css";
import mentions from "./Mentions";
import "../../../node_modules/@draft-js-plugins/mention/lib/plugin.css";
// TOOLBAR
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
} from "@draft-js-plugins/buttons";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
export default function RichEditor({ myState, setMyState, myOnChange, meta }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(meta);
  const { MentionSuggestions, Toolbar, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({ mentionTrigger: ["@", "~"] });
    const toolbarPlugin = createToolbarPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    const { Toolbar } = toolbarPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin, toolbarPlugin];
    return { plugins, MentionSuggestions, Toolbar };
  }, []);
  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, meta));
  }, []);
  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: "line-through",
    },
  };
  const makeStrike = () => {
    console.log("yes");
    setMyState(RichUtils.toggleInlineStyle(myState, "STRIKETHROUGH"));
  };
  return (
    <div
      className={editorStyles.editor}
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        editorKey={"editor"}
        customStyleMap={styleMap}
        placeholder="Placeholder"
        editorState={myState}
        onChange={myOnChange}
        plugins={plugins}
        ref={ref}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={(e) => {
          console.log(e);
        }}
      />
      <Toolbar>
        {
          // may be use React.Fragment instead of div to improve perfomance after React 16
          (externalProps) => (
            <div className="toolbar">
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <StrikethroughSIcon {...externalProps} onClick={makeStrike} />
              {/* <CodeButton {...externalProps} /> */}
              <Separator {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              {/* <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} /> */}
            </div>
          )
        }
      </Toolbar>
    </div>
  );
}
