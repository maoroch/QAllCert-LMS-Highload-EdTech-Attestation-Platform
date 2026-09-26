'use client';

/**
 * MarkdownEditor
 * A self-contained markdown editor with toolbar and live preview.
 * Uses react-markdown for rendering (install: npm i react-markdown remark-gfm).
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Bold, Italic, Strikethrough, Code, Link2, Image,
  List, ListOrdered, Quote, Minus, Heading1, Heading2, Heading3,
  Eye, EyeOff, Columns2, Table,
} from 'lucide-react';

// Lazy-import react-markdown so the editor works even if the package isn't installed yet
let ReactMarkdown: any = null;
let remarkGfm: any = null;

// ── Types ─────────────────────────────────────────────────────────────────

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  minHeight?: number;  // px
  placeholder?: string;
}

type ViewMode = 'edit' | 'split' | 'preview';

// ── Toolbar actions ────────────────────────────────────────────────────────

interface ToolbarAction {
  icon: React.ElementType;
  label: string;
  action: (text: string, sel: { start: number; end: number }) => { text: string; cursor: number | [number, number] };
  shortcut?: string;
}

function wrap(text: string, sel: { start: number; end: number }, before: string, after: string, placeholder: string) {
  const selected = text.slice(sel.start, sel.end) || placeholder;
  const newText = text.slice(0, sel.start) + before + selected + after + text.slice(sel.end);
  const start = sel.start + before.length;
  const end = start + selected.length;
  return { text: newText, cursor: [start, end] as [number, number] };
}

function insertLine(text: string, sel: { start: number; end: number }, prefix: string, placeholder: string) {
  // Find start of current line
  const lineStart = text.lastIndexOf('\n', sel.start - 1) + 1;
  const lineEnd = text.indexOf('\n', sel.end);
  const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
  const content = line || placeholder;
  const newLine = `${prefix}${content}`;
  const newText = text.slice(0, lineStart) + newLine + (lineEnd === -1 ? '' : text.slice(lineEnd));
  const cursor = lineStart + newLine.length;
  return { text: newText, cursor };
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    icon: Heading1, label: 'Heading 1', shortcut: '⌘1',
    action: (t, s) => insertLine(t, s, '# ', 'Heading 1'),
  },
  {
    icon: Heading2, label: 'Heading 2',
    action: (t, s) => insertLine(t, s, '## ', 'Heading 2'),
  },
  {
    icon: Heading3, label: 'Heading 3',
    action: (t, s) => insertLine(t, s, '### ', 'Heading 3'),
  },
  { icon: Bold, label: 'Bold', shortcut: '⌘B', action: (t, s) => wrap(t, s, '**', '**', 'bold text') },
  { icon: Italic, label: 'Italic', shortcut: '⌘I', action: (t, s) => wrap(t, s, '_', '_', 'italic text') },
  { icon: Strikethrough, label: 'Strikethrough', action: (t, s) => wrap(t, s, '~~', '~~', 'strikethrough') },
  { icon: Code, label: 'Inline code', action: (t, s) => wrap(t, s, '`', '`', 'code') },
  {
    icon: Quote, label: 'Blockquote',
    action: (t, s) => insertLine(t, s, '> ', 'Blockquote text'),
  },
  {
    icon: List, label: 'Bullet list',
    action: (t, s) => insertLine(t, s, '- ', 'List item'),
  },
  {
    icon: ListOrdered, label: 'Numbered list',
    action: (t, s) => insertLine(t, s, '1. ', 'List item'),
  },
  {
    icon: Minus, label: 'Horizontal rule',
    action: (t, s) => {
      const ins = '\n---\n';
      return { text: t.slice(0, s.start) + ins + t.slice(s.end), cursor: s.start + ins.length };
    },
  },
  {
    icon: Link2, label: 'Link',
    action: (t, s) => {
      const selected = t.slice(s.start, s.end) || 'link text';
      const ins = `[${selected}](url)`;
      const newText = t.slice(0, s.start) + ins + t.slice(s.end);
      const cursor = s.start + selected.length + 3; // position at "url"
      return { text: newText, cursor };
    },
  },
  {
    icon: Image, label: 'Image',
    action: (t, s) => {
      const ins = '![alt text](image-url)';
      return { text: t.slice(0, s.start) + ins + t.slice(s.end), cursor: s.start + ins.length };
    },
  },
  {
    icon: Table, label: 'Table',
    action: (t, s) => {
      const ins = '\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n';
      return { text: t.slice(0, s.start) + ins + t.slice(s.end), cursor: s.start + ins.length };
    },
  },
];

// ── Markdown renderer ──────────────────────────────────────────────────────

function MarkdownPreview({ content }: { content: string }) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Dynamic import so SSR doesn't break
    Promise.all([
      import('react-markdown').then((m) => { ReactMarkdown = m.default; }),
      import('remark-gfm').then((m) => { remarkGfm = m.default; }),
    ])
      .then(() => setLoaded(true))
      .catch(() => setLoaded(false));
  }, []);

  if (!content.trim()) {
    return <p className="text-slate-400 italic text-sm">Nothing to preview yet.</p>;
  }

  if (!loaded || !ReactMarkdown) {
    // Fallback: plain pre-wrap while loading
    return <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{content}</pre>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }: any) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold text-slate-900 mt-5 mb-2">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-base font-semibold text-slate-800 mt-3 mb-1">{children}</h4>,
        p: ({ children }: any) => <p className="text-slate-700 leading-relaxed mb-3">{children}</p>,
        strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-slate-700">{children}</em>,
        del: ({ children }: any) => <del className="line-through text-slate-400">{children}</del>,
        code: ({ inline, children }: any) =>
          inline
            ? <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
            : <code className="block bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">{children}</code>,
        pre: ({ children }: any) => <pre className="my-4">{children}</pre>,
        blockquote: ({ children }: any) => (
          <blockquote className="border-l-4 border-indigo-300 pl-4 py-1 my-3 bg-indigo-50 rounded-r-lg text-slate-600 italic">{children}</blockquote>
        ),
        ul: ({ children }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-700">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-700">{children}</ol>,
        li: ({ children }: any) => <li className="text-slate-700">{children}</li>,
        hr: () => <hr className="my-5 border-slate-200" />,
        a: ({ href, children }: any) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 hover:underline">{children}</a>
        ),
        img: ({ src, alt }: any) => (
          <img src={src} alt={alt} className="max-w-full rounded-xl my-3 shadow-sm" />
        ),
        table: ({ children }: any) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-slate-200 text-sm rounded-xl overflow-hidden ring-1 ring-slate-200">{children}</table>
          </div>
        ),
        thead: ({ children }: any) => <thead className="bg-slate-50">{children}</thead>,
        tbody: ({ children }: any) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
        tr: ({ children }: any) => <tr>{children}</tr>,
        th: ({ children }: any) => <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{children}</th>,
        td: ({ children }: any) => <td className="px-4 py-2 text-slate-700">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Main editor ────────────────────────────────────────────────────────────

export { MarkdownPreview };
export function MarkdownEditor({
  value,
  onChange,
  minHeight = 320,
  placeholder = 'Write your lecture content here using Markdown…\n\n# Heading\n**Bold**, _italic_, `code`',
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<ViewMode>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyAction = useCallback((action: ToolbarAction['action']) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const sel = { start: ta.selectionStart, end: ta.selectionEnd };
    const result = action(value, sel);
    onChange(result.text);

    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      if (Array.isArray(result.cursor)) {
        textareaRef.current.setSelectionRange(result.cursor[0], result.cursor[1]);
      } else {
        textareaRef.current.setSelectionRange(result.cursor, result.cursor);
      }
      textareaRef.current.focus();
    });
  }, [value, onChange]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey)) {
      if (e.key === 'b') { e.preventDefault(); applyAction(TOOLBAR_ACTIONS.find(a => a.label === 'Bold')!.action); }
      if (e.key === 'i') { e.preventDefault(); applyAction(TOOLBAR_ACTIONS.find(a => a.label === 'Italic')!.action); }
    }
    // Tab → indent with 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newText = value.slice(0, start) + '  ' + value.slice(end);
      onChange(newText);
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(start + 2, start + 2);
      });
    }
  }, [applyAction, value, onChange]);

  const VIEW_TABS: { key: ViewMode; label: string; icon: React.ElementType }[] = [
    { key: 'edit',    label: 'Edit',    icon: EyeOff },
    { key: 'split',   label: 'Split',   icon: Columns2 },
    { key: 'preview', label: 'Preview', icon: Eye },
  ];

  // Separate toolbar groups
  const TOOLBAR_GROUPS = [
    TOOLBAR_ACTIONS.slice(0, 3),   // headings
    TOOLBAR_ACTIONS.slice(3, 7),   // inline
    TOOLBAR_ACTIONS.slice(7, 11),  // lists + divider
    TOOLBAR_ACTIONS.slice(11),     // links + table
  ];

  return (
    <div className="rounded-xl ring-1 ring-slate-200 overflow-hidden bg-white">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <span className="w-px h-5 bg-slate-300 mx-1" />}
              {group.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  title={action.label + (action.shortcut ? ` (${action.shortcut})` : '')}
                  onClick={() => applyAction(action.action)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <action.icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* View mode switcher */}
        <div className="flex items-center bg-slate-200 rounded-lg p-0.5 flex-shrink-0">
          {VIEW_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                mode === key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Editor / Preview panes ── */}
      <div className={`flex ${mode === 'split' ? 'divide-x divide-slate-200' : ''}`}
           style={{ minHeight }}>
        {/* Editor pane */}
        {(mode === 'edit' || mode === 'split') && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            spellCheck
            className="flex-1 resize-none p-4 text-sm font-mono text-slate-800 bg-white outline-none leading-relaxed placeholder:text-slate-300"
            style={{ minHeight, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
          />
        )}

        {/* Preview pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className="flex-1 overflow-y-auto p-5 bg-white"
            style={{ minHeight }}
          >
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>

      {/* ── Footer: char count + markdown hint ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-400">
        <span>Markdown supported · <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-500 text-xs">⌘B</kbd> bold · <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-500 text-xs">⌘I</kbd> italic · <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-500 text-xs">Tab</kbd> indent</span>
        <span>{value.length} chars</span>
      </div>
    </div>
  );
}

export default MarkdownEditor;
