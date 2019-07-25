import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import EditorFilesExplorer from './EditorFilesExplorer';
import { LayoutContainer, LayoutMain, LayoutSidebar } from './CodeSectionUI';

const CodeSection = () => {
  // Used to set code value of CodeEditor
  const [code, setCode] = useState(null);

  return (
    <LayoutContainer>
      <LayoutSidebar>
        <EditorFilesExplorer setCode={setCode} />
      </LayoutSidebar>
      <LayoutMain>
        <CodeEditor code={code} clearCode={() => setCode(null)} />
      </LayoutMain>
    </LayoutContainer>
  );
};

export default CodeSection;
