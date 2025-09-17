// "use client";
// import React from "react";

// export default function RenderPageClient({ html, css, wrapperClass }: { html: string; css: string; wrapperClass: string; }) {
//   return (
//     <div className={wrapperClass}>
//       {/* Inject scoped CSS */}
//       <style dangerouslySetInnerHTML={{ __html: css }} />
//       {/* Inject sanitized HTML */}
//       <div dangerouslySetInnerHTML={{ __html: html }} />
//     </div>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

export default function GrapesRenderer({ json, css }: { json: any; css?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100vh",
      storageManager: false,
    });

    editor.setComponents(json);
    if (css) editor.setStyle(css);

    return () => editor.destroy();
  }, [json, css]);

  return <div ref={containerRef} />;
}
