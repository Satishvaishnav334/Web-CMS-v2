"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import grapesjs from "grapesjs";

interface StudioEditorProps {
  onEditor?: (editor: any) => void;
  options?: any;
  initialHtml?: string;
  initialCss?: string;
}

const StudioEditor = forwardRef<any, StudioEditorProps>(
  ({ onEditor, options, initialHtml, initialCss }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<any>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      editorRef.current = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        ...options,
      });

      if (initialHtml) editorRef.current.setComponents(initialHtml);
      if (initialCss) editorRef.current.setStyle(initialCss);

      if (onEditor) onEditor(editorRef.current);

      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
    }));

    return <div ref={containerRef} className="w-full h-[80vh]" />;
  }
);

StudioEditor.displayName = "StudioEditor";
export default StudioEditor;
