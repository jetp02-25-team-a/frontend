'use client';
import { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default function TeamUpEditArticlePage() {
  const [value, setValue] = useState('## 你好，Markdown！');

  const options = {
    spellChecker: false, // 關掉拼字檢查
    placeholder: '開始寫文章吧...',
    autosave: {
      enabled: true,
      delay: 1000,
      uniqueId: 'my-article',
    },
    status: false, // 不顯示底部狀態列
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      // '|',
      // 'link',
      // 'image',
      // '|',
      // {
      //   name: 'custom',
      //   action: () => alert('你按了自訂按鈕 ✨'),
      //   className: 'fa fa-star',
      //   title: '自訂功能',
      // },
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      // '|',
      // 'guide',
    ] as any,
  };
  return (
    <>
      <h1>edit page</h1>
      <SimpleMDE value={value} onChange={setValue} options={options} />
      <pre>{value}</pre>
    </>
  );
}
