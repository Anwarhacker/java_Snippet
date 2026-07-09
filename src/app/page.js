"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight, shadesOfPurple, nord } from "react-syntax-highlighter/dist/esm/styles/prism";

// Inline SVG Icons
const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-1.5V9a3 3 0 0 0-3-3h-3.922a3 3 0 0 1-2.22-.98L7.872 3.862A3 3 0 0 0 5.652 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.902 4.102a2.25 2.25 0 0 0-1.502-1.502V5.25c0 .414.336.75.75.75h.752Z" clipRule="evenodd" />
    <path d="M16.5 7.5h.75a2.25 2.25 0 0 0 1.502-1.502V6.75a2.25 2.25 0 0 0-1.502-1.502v.752c0 .414-.336.75-.75.75h-.752Z" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M21.731 2.269a2.625 2.625 0 0 1 0 3.712l-1.21 1.211-3.712-3.712 1.21-1.211a2.625 2.625 0 0 1 3.712 0ZM19.5 8.25 18.289 9.46 14.54 5.71 15.75 4.5 19.5 8.25ZM17.062 10.688 7.28 20.47a2.25 2.25 0 0 1-1.072.576l-3.266.817a.75.75 0 0 1-.921-.921l.817-3.266a2.25 2.25 0 0 1 .576-1.072l9.782-9.78 3.75 3.75Z" />
  </svg>
);

const IconRename = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="8" y1="12" x2="16" y2="12"></line>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="10" y1="5" x2="14" y2="5"></line>
    <line x1="10" y1="19" x2="14" y2="19"></line>
  </svg>
);

const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path fillRule="evenodd" d="M16.5 4.478v-.478a3.375 3.375 0 0 0-3.375-3.375h-2.25a3.375 3.375 0 0 0-3.375 3.375v.478a48.566 48.566 0 0 0-6 3.75c-.179.168-.217.43-.109.646.108.214.33.334.568.314l1.277-.107 1.34 14.24a4.5 4.5 0 0 0 4.482 4.079h6.86a4.5 4.5 0 0 0 4.482-4.08l1.34-14.24 1.277.106c.239.02.46-.1.569-.314.108-.215.07-.477-.109-.647a48.567 48.567 0 0 0-6-3.75ZM9 4.478a21.3 21.3 0 0 1 6 0v-.478a1.875 1.875 0 0 0-1.875-1.875h-2.25a1.875 1.875 0 0 0-1.875 1.875v.478Z" clipRule="evenodd" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M1.5 4.5a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v1.5a3 3 0 0 1-3 3h-1.5a3 3 0 0 1-3-3V4.5ZM1.5 15a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v1.5a3 3 0 0 1-3 3h-1.5a3 3 0 0 1-3-3V15ZM15 1.5a3 3 0 0 0-3 3v1.5a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3V4.5a3 3 0 0 0-3-3H15ZM12 15a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v1.5a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V15Z" />
  </svg>
);

const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
  </svg>
);

const IconBookmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M6.32 2.577a3 3 0 0 1 3.16 0L12 3.846l2.52-1.269a3 3 0 0 1 3.16 0C18.67 3.23 19.5 4.34 19.5 5.56v13.56a.75.75 0 0 1-1.18.608l-6.32-4.516-6.32 4.516A.75.75 0 0 1 4.5 19.12V5.56c0-1.22.83-2.33 1.82-2.983Z" clipRule="evenodd" />
  </svg>
);

const IconSave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 1.5a.75.75 0 0 1 .75.75V13.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5Z" />
    <path d="M16.28 9.22a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l3.22 3.22 3.22-3.22a.75.75 0 0 1 1.06 0Z" />
    <path d="M4.5 16.5A1.5 1.5 0 0 0 3 18v1.5a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V18a1.5 1.5 0 0 0-1.5-1.5H4.5Z" />
  </svg>
);

const IconJava = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M9.13 14.502c-.35 0-.69.074-1.007.204-.33.136-.618.34-.844.593-.21.233-.365.512-.45.814-.085.3-.13.626-.13.95 0 .324.045.648.134.95.09.303.243.58.452.813.226.254.513.457.844.593a3.3 3.3 0 0 0 1.007.204 3.1 3.1 0 0 0 .977-.184l.325.213c-.394.24-.81.428-1.246.545a6.01 6.01 0 0 1-1.57.21c-.482 0-.95-.06-1.4-.176l-.164-.04a5.35 5.35 0 0 1-1.21-.527 4.7 4.7 0 0 1-.95-.693 4.3 4.3 0 0 1-.68-.84 4.35 4.35 0 0 1-.41-.95 6.07 6.07 0 0 1-.15-1.12c0-.394.053-.783.153-1.162.095-.36.242-.705.438-1.02.2-.32.428-.6.715-.84a4.52 4.52 0 0 1 1.05-.623c.39-.16.804-.275 1.25-.327l.11-.013c.35 0 .707.037 1.066.11l.34.07c.36.08.7.208 1.03.385l-.337.26-.013-.01a1.28 1.28 0 0 0-.284-.142 3.1 3.1 0 0 0-.498-.103 2.5 2.5 0 0 0-.58-.066Zm11.02 1.492c.11 0 .216.016.32.046.104.03.2.072.28.125.084.053.155.12.217.2a.53.53 0 0 1 .116.33c0 .114-.027.228-.083.33a1.01 1.01 0 0 1-.21.283c-.084.07-.18.122-.284.156a1.27 1.27 0 0 1-.36.054c-.114 0-.22-.016-.33-.046-.103-.03-.197-.07-.282-.124a.59.59 0 0 1-.2-.19c-.06-.076-.1-.167-.116-.27-.01-.064-.01-.13-.01-.194a.63.63 0 0 1 .12-.34.62.62 0 0 1 .2-.2c.08-.064.17-.113.275-.145.105-.03.22-.047.33-.047Zm-6.57 3.321c-.347 0-.687-.075-1.01-.213-.323-.138-.6-.342-.83-.605-.22-.25-.38-.54-.48-.86-.1-.318-.15-.657-.15-1a3.87 3.87 0 0 1 .15-1c.1-.318.26-.607.48-.86.23-.263.507-.467.83-.605.323-.138.663-.213 1.01-.213.35 0 .7.075 1.03.213.33.138.614.342.85.605.234.253.407.542.51.86.107.318.16.657.16 1a3.81 3.81 0 0 1-.16 1.02c-.103.318-.276.61-.51.86a3.21 3.21 0 0 1-.85.605c-.33.138-.68.213-1.03.213Zm-.023-4.22c-.16 0-.317.03-.473.09-.16.06-.29.146-.407.26-.11.113-.197.247-.26.403-.06.155-.09.324-.09.507 0 .183.03.352.09.507.063.156.15.29.26.403.117.114.247.2.404.26.153.06.313.09.476.09.163 0 .323-.03.48-.09.157-.06.287-.146.404-.26.113-.113.2-.247.26-.403.06-.155.09-.324.09-.507s-.03-.352-.09-.507a1.08 1.08 0 0 0-.26-.403 1.25 1.25 0 0 0-.404-.26 1.35 1.35 0 0 0-.48-.09Zm6.82-.471h1.36c.247 0 .423.05.534.156.11.107.163.26.2.457h-1.63a.85.85 0 0 0-.304-.15.42.42 0 0 0-.16-.063Zm1.36.42a.57.57 0 0 1 .16.06 1.03 1.03 0 0 1 .153.153h-1.61c.07-.123.18-.21.323-.263a.74.74 0 0 1 .304-.09l.67.14Z" />
    <path d="M12.44 2.1c.143-.88.667-1.352 1.57-1.416-.273.74-.256 1.36.216 1.864.444.47 1.157.64 1.886.608-.184.97-.84 1.536-1.92 1.632.41 1.05.02 2.304-1.127 2.592.51.616 1.076.672 1.706.12.307.728.845 1.048 1.63.92-.05.904-.45 1.488-1.22 1.768.423 1 1.42 1.42 1.6 1.848-1.114.48-1.57.19-2.083-.752.12-.904 0-1.872-.345-2.888-.34.336-.717.208-1.14-.384-.042 1.008.204 2.104.75 3.288-1.09-.32-1.397-1.04-1.453-2.144-.33.39-.77.408-1.31.06.012 1.008.312 2.056.887 3.128-1.507.03-2.02-.75-1.554-2.32-.44.208-.853.144-1.238-.192-.092 1.744.133 3.328.692 4.712.18-.528.4-.768.647-.7 0 .5-.26.96-.77 1.43 1.336 2.056 4.394 2.456 9.173 1.2.333-.08.613-.12.833-.12.633.35.8.683.5 1-.416.48-1.516.897-3.3 1.248-1.784.35-3.35.48-4.7.384-.4.896-1.55 1.336-3.46 1.32l-.18.006c-1.894 0-3.033-.422-3.413-1.266a15.82 15.82 0 0 1-2.907-.744c-.753-.296-1.44-.648-2.062-1.056a8.86 8.86 0 0 1-1.63-.128c-.287.05-.18.176.3.376.104.043.21.09.317.14.73.344 1.543.6 2.433.776.38.64 1.38.96 3 .96 1.014.12 2.22-.05 3.63-.48 1.4-.416 2.307-.864 2.7-1.344.92.056 1.953.048 3.1-.024.013-.264-.136-.59-.446-.984-2.733-.064-4.887-.416-6.467-1.056-1.46-.592-2.303-1.28-2.527-2.064-.136-.456-.076-.95.18-1.48s.6-.96 1.034-1.28c-.1-.728-.15-1.544-.15-2.448v-.384c0-.368.01-.736.03-1.104a3.86 3.86 0 0 1-.51-1.056c-.05-.176-.113-.368-.18-.57l-.36-1.05c-.173-.504-.32-.976-.43-1.42s-.167-.84-.167-1.18c0-.98.375-1.73.535-1.92.544-.64.84-2.3 2.16-2.3M5.1 16.59c-.43.32-.714.712-.85 1.176.223.784 1.066 1.472 2.527 2.064 1.433.576 3.393.128 5.88 1.056.244.312.383.56.417.744.33-.008 1.28-.27 2.85-.792-5.467.4-8.8-1.192-10-4.248-.266-.64-.31-1.343.826-.001Zm3.71-3.696c.013.904.063 1.72.15 2.448.16.896.53 1.632 1.11 2.208a8.8 8.8 0 0 1 2.31 1.256c.224.784 1.067 1.472 2.527 2.064.207.085.426.166.65.244-.223-.744-1.366-2.128-4.437-2.6-1-1-1.42-2.336-1.31-4-.33.39-.7.424-1.01.392Z" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconMarkdown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM2 2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
    <path d="M3.5 11V5H5l1.25 1.75L7.5 5h1.5v6H7.75V7.25L6.5 9l-1.25-1.75V11H3.5zm7.25-2V5H12v4h1l-1.75 2L9.5 9h1.25z"/>
  </svg>
);

// Helper for inline markdown parsing
function parseInline(text) {
  if (!text) return "";
  const parts = [];
  let remaining = text;
  let key = 0;
  
  while (remaining) {
    const codeIdx = remaining.indexOf("`");
    const boldIdx = remaining.indexOf("**");
    const italicIdx = remaining.indexOf("*");
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const linkIdx = linkMatch ? linkMatch.index : -1;

    let matches = [];
    if (codeIdx !== -1) matches.push({ type: "code", index: codeIdx });
    if (boldIdx !== -1) matches.push({ type: "bold", index: boldIdx });
    if (italicIdx !== -1 && italicIdx !== boldIdx) matches.push({ type: "italic", index: italicIdx });
    if (linkIdx !== -1) matches.push({ type: "link", index: linkIdx, length: linkMatch[0].length, text: linkMatch[1], url: linkMatch[2] });

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, first.index)}</span>);
    }

    if (first.type === "code") {
      const nextCode = remaining.indexOf("`", first.index + 1);
      if (nextCode !== -1) {
        const codeText = remaining.slice(first.index + 1, nextCode);
        parts.push(<code key={key++} className="inline-code" style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--bg-input)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.85rem", border: "1px solid var(--border-color)", color: "var(--primary)" }}>{codeText}</code>);
        remaining = remaining.slice(nextCode + 1);
      } else {
        parts.push(<span key={key++}>`</span>);
        remaining = remaining.slice(first.index + 1);
      }
    } else if (first.type === "bold") {
      const nextBold = remaining.indexOf("**", first.index + 2);
      if (nextBold !== -1) {
        const boldText = remaining.slice(first.index + 2, nextBold);
        parts.push(<strong key={key++} style={{ fontWeight: "700", color: "var(--text-primary)" }}>{parseInline(boldText)}</strong>);
        remaining = remaining.slice(nextBold + 2);
      } else {
        parts.push(<span key={key++}>**</span>);
        remaining = remaining.slice(first.index + 2);
      }
    } else if (first.type === "italic") {
      const nextItalic = remaining.indexOf("*", first.index + 1);
      if (nextItalic !== -1) {
        const italicText = remaining.slice(first.index + 1, nextItalic);
        parts.push(<em key={key++} style={{ fontStyle: "italic" }}>{parseInline(italicText)}</em>);
        remaining = remaining.slice(nextItalic + 1);
      } else {
        parts.push(<span key={key++}>*</span>);
        remaining = remaining.slice(first.index + 1);
      }
    } else if (first.type === "link") {
      parts.push(
        <a 
          key={key++} 
          href={first.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "var(--primary)", textDecoration: "underline" }}
        >
          {first.text}
        </a>
      );
      remaining = remaining.slice(first.index + first.length);
    }
  }

  return parts;
}

// MarkdownRenderer component
function MarkdownRenderer({ content, syntaxTheme }) {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-preview-content">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();
          return (
            <div key={index} className="md-code-block-wrapper" style={{ margin: "14px 0" }}>
              {lang && <div className="md-code-lang" style={{ fontSize: "0.75rem", padding: "4px 8px", backgroundColor: "var(--bg-input)", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", color: "var(--text-muted)", width: "fit-content", borderBottom: "1px solid var(--border-color)" }}>{lang.toUpperCase()}</div>}
              <SyntaxHighlighter
                language={lang || "text"}
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  backgroundColor: 'var(--bg-editor)',
                  fontSize: '0.85rem',
                  borderRadius: lang ? '0 0 8px 8px' : '8px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          const lines = part.split("\n");
          let listStarted = false;
          let listElements = [];
          const outputElements = [];

          const finalizeList = (key) => {
            if (listElements.length > 0) {
              outputElements.push(
                <ul key={`ul-${key}`} className="md-ul" style={{ paddingLeft: "20px", margin: "8px 0" }}>
                  {listElements}
                </ul>
              );
              listElements = [];
              listStarted = false;
            }
          };

          lines.forEach((line, lineIdx) => {
            const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
            if (headerMatch) {
              finalizeList(lineIdx);
              const level = headerMatch[1].length;
              const text = headerMatch[2];
              const Tag = `h${level}`;
              outputElements.push(<Tag key={lineIdx}>{parseInline(text)}</Tag>);
              return;
            }

            if (line.startsWith(">")) {
              finalizeList(lineIdx);
              const text = line.substring(1).trim();
              outputElements.push(
                <blockquote key={lineIdx} style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "16px", color: "var(--text-secondary)", margin: "16px 0", fontStyle: "italic" }}>
                  {parseInline(text)}
                </blockquote>
              );
              return;
            }

            if (line.trim() === "---") {
              finalizeList(lineIdx);
              outputElements.push(<hr key={lineIdx} style={{ border: "0", borderTop: "1px solid var(--border-color)", margin: "1.5rem 0" }} />);
              return;
            }

            const listMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
            if (listMatch) {
              listStarted = true;
              const text = listMatch[2];
              listElements.push(<li key={`li-${lineIdx}`} style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{parseInline(text)}</li>);
              return;
            }

            const numListMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
            if (numListMatch) {
              listStarted = true;
              const text = numListMatch[2];
              listElements.push(<li key={`li-${lineIdx}`} style={{ margin: "4px 0", color: "var(--text-secondary)", listStyleType: "decimal" }}>{parseInline(text)}</li>);
              return;
            }

            if (line.trim() === "") {
              finalizeList(lineIdx);
              outputElements.push(<div key={`br-${lineIdx}`} style={{ height: "0.5rem" }} />);
            } else {
              finalizeList(lineIdx);
              outputElements.push(
                <p key={lineIdx} style={{ margin: "8px 0", lineHeight: "1.6", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {parseInline(line)}
                </p>
              );
            }
          });

          finalizeList("end");
          return <div key={index}>{outputElements}</div>;
        }
      })}
    </div>
  );
}


export default function Home() {
  const [currentPath, setCurrentPath] = useState("");
  const [parentPath, setParentPath] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [theme, setTheme] = useState("midnight");

  useEffect(() => {
    const savedTheme = localStorage.getItem("localspace-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("localspace-theme", newTheme);
  };

  const getSyntaxTheme = () => {
    switch (theme) {
      case "alabaster": return oneLight;
      case "cyberpunk": return shadesOfPurple;
      case "emerald": return nord;
      default: return vscDarkPlus;
    }
  };
  
  // Custom Bookmarks/Sidebar Paths
  const [bookmarks, setBookmarks] = useState([]);
  
  // UI Controls
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");
  const [pathInput, setPathInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modals state
  const [createModal, setCreateModal] = useState({ isOpen: false, type: "file" }); // type = file or folder
  const [renameModal, setRenameModal] = useState({ isOpen: false, item: null });
  const [newItemName, setNewItemName] = useState("");
  const [renameNewName, setRenameNewName] = useState("");

  // Java Snippets State
  const [showJavaLab, setShowJavaLab] = useState(false);
  const [javaSnippets, setJavaSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditingSnippet, setIsEditingSnippet] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [snippetDescription, setSnippetDescription] = useState("");
  const [snippetLevel, setSnippetLevel] = useState("Easy"); // Easy, Medium, Hard
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetCategory, setSnippetCategory] = useState(""); // Category/Pattern (e.g. Sliding Window)

  // Console Execution State
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Computed: Group Java Snippets by Category for Sidebar
  const snippetCategories = useMemo(() => {
    const counts = {};
    javaSnippets.forEach(s => {
      const cat = s.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    // Convert to sorted array of objects
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [javaSnippets]);

  const [levelFilter, setLevelFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Collapsible Sections State
  const [collapsedSections, setCollapsedSections] = useState({
    bookmarks: false,
    workspace: false,
    labs: false,
    markdown: false
  });

  // Editor state
  const [editingFile, setEditingFile] = useState(null); // { path: '...', name: '...', content: '...' }
  const [editorContent, setEditorContent] = useState("");
  const [editorMode, setEditorMode] = useState("preview"); // preview or edit
  const [isSavingFile, setIsSavingFile] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Drag and Drop Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const dragCounter = useRef(0);

  // Fetch bookmarks on mount or set default
  useEffect(() => {
    const saved = localStorage.getItem("localspace-bookmarks");
    let currentBookmarks = [];
    if (saved) {
      currentBookmarks = JSON.parse(saved);
    }
    
    // Ensure Kodnest-Java is always in bookmarks
    const defaultPath = "C:\\Users\\anwar\\OneDrive\\Desktop\\Kodnest-Java";
    const hasDefault = currentBookmarks.some(b => b.path.toLowerCase() === defaultPath.toLowerCase());
    if (!hasDefault) {
      currentBookmarks.unshift({ name: "Kodnest-Java", path: defaultPath });
      localStorage.setItem("localspace-bookmarks", JSON.stringify(currentBookmarks));
    }
    setBookmarks(currentBookmarks);
    
    // Initial fetch of default directory
    loadDirectory(defaultPath);

    // Load Java Snippets from Local File API
    const loadSnippets = async () => {
      try {
        const res = await fetch("/api/snippets");
        if (res.ok) {
          const fileSnippets = await res.json();
          
          // Migration check: if localStorage has snippets, merge them
          const savedSnippets = localStorage.getItem("localspace-java-snippets");
          if (savedSnippets) {
            const localSnippets = JSON.parse(savedSnippets);
            // Simple merge: add local snippets that don't exist by ID in file snippets
            const fileIds = new Set(fileSnippets.map(s => s.id));
            const merged = [...fileSnippets];
            localSnippets.forEach(ls => {
              if (!fileIds.has(ls.id)) {
                merged.push(ls);
              }
            });
            
            if (merged.length > fileSnippets.length) {
              setJavaSnippets(merged);
              saveSnippetsToLocal(merged); // Persist to file
            } else {
              setJavaSnippets(fileSnippets);
            }
            // Clear localStorage key after migration
            localStorage.removeItem("localspace-java-snippets");
          } else {
            setJavaSnippets(fileSnippets);
          }
        }
      } catch (err) {
        console.error("Failed to load snippets:", err);
      }
    };

    loadSnippets();

    // Load Collapsed Sections
    const savedCollapsed = localStorage.getItem("localspace-sidebar-collapsed");
    if (savedCollapsed) {
      setCollapsedSections(JSON.parse(savedCollapsed));
    }

    // Load Sidebar State
    const savedSidebarCollapsed = localStorage.getItem("localspace-sidebar-main-collapsed");
    if (savedSidebarCollapsed) {
      setIsSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  const saveSnippetsToLocal = async (snippets) => {
    setJavaSnippets(snippets);
    try {
      await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snippets),
      });
    } catch (err) {
      console.error("Failed to save snippets to file:", err);
      showToast("error", "Sync Error", "Failed to save snippets to local file.");
    }
  };

  const showToast = (type, title, desc) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const uploadFiles = async (files, targetPath) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    
    showToast("info", "Starting Upload", `Uploading ${fileList.length} file(s)...`);
    
    let uploadedCount = 0;
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("parentPath", targetPath);

      try {
        const res = await fetch("/api/fs/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          uploadedCount++;
        } else {
          showToast("error", "Upload Failed", `${file.name}: ${data.error}`);
        }
      } catch (err) {
        showToast("error", "Upload Error", `${file.name}: ${err.message}`);
      }
    }
    
    if (uploadedCount > 0) {
      showToast("success", "Upload Complete", `Successfully uploaded ${uploadedCount} file(s).`);
    }
    
    // Refresh directory
    loadDirectory(currentPath);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files, currentPath);
    }
  };

  const loadDirectory = async (targetPath = "") => {
    setIsLoading(true);
    setSelectedItem(null);
    try {
      const url = targetPath 
        ? `/api/fs?path=${encodeURIComponent(targetPath)}`
        : `/api/fs`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setCurrentPath(data.currentPath);
        setParentPath(data.parentPath);
        setItems(data.items);
        setPathInput(data.currentPath);
        
        // Dynamically add to bookmarks if not present
        updateBookmarksList(data.currentPath);
      } else {
        showToast("error", "Failed to load directory", data.error || "Unknown error");
        // If initial load fails, try default
        if (targetPath) {
          loadDirectory("");
        }
      }
    } catch (err) {
      showToast("error", "Error requesting directory details", err.message);
    } finally {
      setIsLoading(false);
      setShowJavaLab(false);
    }
  };

  const updateBookmarksList = (pathStr) => {
    if (!pathStr) return;
    const saved = localStorage.getItem("localspace-bookmarks");
    let list = saved ? JSON.parse(saved) : [];
    
    // Check if path is already bookmarked
    const exists = list.some(b => b.path.toLowerCase() === pathStr.toLowerCase());
    if (!exists) {
      // Add standard label (either drive name or folder name)
      const parts = pathStr.split(/[\\/]/).filter(Boolean);
      const name = parts.length > 0 ? parts[parts.length - 1] : pathStr;
      const newList = [...list, { name, path: pathStr }];
      // Keep bookmarks to reasonable size (e.g. 8 max)
      if (newList.length > 8) newList.shift();
      setBookmarks(newList);
      localStorage.setItem("localspace-bookmarks", JSON.stringify(newList));
    }
  };

  const handlePathSubmit = (e) => {
    e.preventDefault();
    if (pathInput.trim()) {
      loadDirectory(pathInput.trim());
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await fetch("/api/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: createModal.type,
          parentPath: currentPath,
          name: newItemName.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", `Created ${createModal.type === "file" ? "File" : "Folder"}`, newItemName.trim());
        setCreateModal({ isOpen: false, type: "file" });
        setNewItemName("");
        loadDirectory(currentPath);
      } else {
        showToast("error", "Creation Failed", data.error || "Check permissions or availability");
      }
    } catch (err) {
      showToast("error", "Network Error", err.message);
    }
  };

  const handleRenameResource = async (e) => {
    e.preventDefault();
    if (!renameNewName.trim() || !renameModal.item) return;

    const sourcePath = renameModal.item.path;
    // Replace the last path segment with the new name
    const parts = sourcePath.split(/[\\/]/);
    parts[parts.length - 1] = renameNewName.trim();
    const destinationPath = parts.join(sourcePath.includes("\\") ? "\\" : "/");

    try {
      const res = await fetch("/api/fs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath, destinationPath }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", "Resource Renamed", `New name: ${renameNewName.trim()}`);
        setRenameModal({ isOpen: false, item: null });
        setRenameNewName("");
        loadDirectory(currentPath);
      } else {
        showToast("error", "Rename Failed", data.error || "Unable to rename resource");
      }
    } catch (err) {
      showToast("error", "Network Error", err.message);
    }
  };

  const handleDeleteResource = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"? This operation is permanent.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/fs?path=${encodeURIComponent(item.path)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", "Resource Deleted", item.name);
        if (selectedItem?.path === item.path) {
          setSelectedItem(null);
        }
        if (editingFile?.path === item.path) {
          setEditingFile(null);
        }
        loadDirectory(currentPath);
      } else {
        showToast("error", "Deletion Failed", data.error || "Insufficient access");
      }
    } catch (err) {
      showToast("error", "Network Error", err.message);
    }
  };

  const handleFileClick = async (item) => {
    setSelectedItem(item);
    
    // Double click actions or auto open. Let's make single click select, 
    // and if it's a file we can show details. If double click, we open.
  };

  const handleDoubleClick = async (item) => {
    if (item.isDir) {
      loadDirectory(item.path);
    } else {
      // Open file in Editor
      openFileInEditor(item);
    }
  };

  const openFileInEditor = async (item) => {
    try {
      const res = await fetch(`/api/fs/content?path=${encodeURIComponent(item.path)}`);
      const data = await res.json();
      
      if (res.ok) {
        setEditingFile(item);
        setEditorContent(data.content);
        if (item.name.toLowerCase().endsWith(".md")) {
          setEditorMode("preview");
        } else {
          setEditorMode("edit");
        }
        showToast("success", "Loaded File", item.name);
      } else {
        showToast("error", "Cannot Open File", data.error || "This file may be binary or locked.");
      }
    } catch (err) {
      showToast("error", "Error loading file content", err.message);
    }
  };

  const saveFileContent = async () => {
    if (!editingFile) return;
    setIsSavingFile(true);
    try {
      const res = await fetch("/api/fs/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: editingFile.path,
          content: editorContent,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", "File Saved Successfully", editingFile.name);
        // Refresh directory stats to update file sizes if changed
        loadDirectory(currentPath);
      } else {
        showToast("error", "Save Failed", data.error || "Make sure file is not write-protected.");
      }
    } catch (err) {
      showToast("error", "Network Error", err.message);
    } finally {
      setIsSavingFile(false);
    }
  };

  const copyFileContent = async (item) => {
    if (item.isDir) return;
    try {
      const res = await fetch(`/api/fs/content?path=${encodeURIComponent(item.path)}`);
      const data = await res.json();
      if (res.ok) {
        await navigator.clipboard.writeText(data.content);
        showToast("success", "Copied to Clipboard", `${item.name} content copied.`);
      } else {
        showToast("error", "Copy Failed", data.error || "Cannot read file content");
      }
    } catch (err) {
      showToast("error", "Copy Error", err.message);
    }
  };

  const copyEditorContent = async () => {
    if (!editingFile) return;
    try {
      await navigator.clipboard.writeText(editorContent);
      showToast("success", "Copied to Clipboard", "Editor contents copied.");
    } catch (err) {
      showToast("error", "Copy Error", err.message);
    }
  };

  const handleCreateSnippet = () => {
    const newSnippet = {
      id: Math.random().toString(36).substring(2, 9),
      name: "New Snippet.java",
      description: "Quick Java logic piece",
      level: "Easy",
      code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java Snippet!\");\n    }\n}",
      createdAt: new Date().toISOString()
    };
    const newList = [newSnippet, ...javaSnippets];
    saveSnippetsToLocal(newList);
    setSelectedSnippet(newSnippet);
    setIsEditingSnippet(true);
    setSnippetName(newSnippet.name);
    setSnippetDescription(newSnippet.description);
    setSnippetLevel(newSnippet.level);
    setSnippetCategory("");
    setSnippetCode("");
    setConsoleOutput("");
    showToast("success", "Snippet Created", "New Java snippet added.");
  };

  const handleSaveSnippet = () => {
    if (!selectedSnippet) return;
    const updatedSnippets = javaSnippets.map(s => 
      s.id === selectedSnippet.id ? { ...s, name: snippetName, description: snippetDescription, level: snippetLevel, category: snippetCategory, code: snippetCode, output: consoleOutput } : s
    );
    saveSnippetsToLocal(updatedSnippets);
    setSelectedSnippet({ ...selectedSnippet, name: snippetName, description: snippetDescription, level: snippetLevel, category: snippetCategory, code: snippetCode, output: consoleOutput });
    setIsEditingSnippet(false);
    showToast("success", "Snippet Saved", snippetName);
  };

  const handleDeleteSnippet = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;
    const newList = javaSnippets.filter(s => s.id !== id);
    saveSnippetsToLocal(newList);
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null);
      setIsEditingSnippet(false);
    }
    showToast("info", "Snippet Deleted", "Snippet removed from your collection.");
  };

  const handleExportSnippet = async () => {
    if (!selectedSnippet) return;
    
    const targetPath = currentPath || "C:\\Users\\anwar\\OneDrive\\Desktop\\Kodnest-Java";
    
    try {
      const res = await fetch("/api/snippets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedSnippet.name,
          code: selectedSnippet.code,
          targetPath: targetPath,
          category: selectedSnippet.category
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Exported to Workspace", `Saved as ${selectedSnippet.name} in ${targetPath}`);
        // Refresh directory to show the new file
        loadDirectory(targetPath);
      } else {
        showToast("error", "Export Failed", data.error);
      }
    } catch (err) {
      showToast("error", "Export Error", err.message);
    }
  };

  const handleSaveSnippetOutput = async () => {
    if (!selectedSnippet) return;
    const updatedSnippet = { ...selectedSnippet, output: consoleOutput };
    const updatedSnippets = javaSnippets.map(s => 
      s.id === selectedSnippet.id ? updatedSnippet : s
    );
    await saveSnippetsToLocal(updatedSnippets);
    setSelectedSnippet(updatedSnippet);
    showToast("success", "Output Saved", "Execution output persisted for this snippet.");
  };

  const toggleSection = (section) => {
    const newState = { ...collapsedSections, [section]: !collapsedSections[section] };
    setCollapsedSections(newState);
    localStorage.setItem("localspace-sidebar-collapsed", JSON.stringify(newState));
  };

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("localspace-sidebar-main-collapsed", JSON.stringify(newState));
  };

  // Filter items based on query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format byte sizes
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Helper to format date
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate breadcrumbs segments
  const renderBreadcrumbs = () => {
    if (!currentPath) return null;
    
    const separator = currentPath.includes("\\") ? "\\" : "/";
    const defaultWorkspaceDir = "C:\\Users\\anwar\\OneDrive\\Desktop\\Kodnest-Java";
    const normalizedPath = currentPath.toLowerCase().replace(/\\/g, "/");
    const normalizedWorkspace = defaultWorkspaceDir.toLowerCase().replace(/\\/g, "/");
    
    // Case 1: Inside the main Kodnest-Java Workspace
    if (normalizedPath.startsWith(normalizedWorkspace)) {
      const relativePart = currentPath.substring(defaultWorkspaceDir.length);
      const parts = relativePart.split(separator).filter(Boolean);
      
      let accumulatedPath = defaultWorkspaceDir;
      
      return (
        <div className="breadcrumbs-container">
          <span 
            className={`breadcrumb-item ${parts.length === 0 ? "active" : ""}`}
            onClick={() => parts.length > 0 && loadDirectory(defaultWorkspaceDir)}
          >
            Workspace
          </span>
          {parts.map((part, index) => {
            accumulatedPath += separator + part;
            const currentAccumulated = accumulatedPath;
            const isLast = index === parts.length - 1;
            
            return (
              <span key={index} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="breadcrumb-sep"><IconChevronRight /></span>
                <span 
                  className={`breadcrumb-item ${isLast ? "active" : ""}`}
                  onClick={() => !isLast && loadDirectory(currentAccumulated)}
                >
                  {part}
                </span>
              </span>
            );
          })}
        </div>
      );
    }
    
    // Case 2: Outside Workspace, but we can shorten C:\Users\anwar
    const homePrefix = "C:\\Users\\anwar";
    const normalizedHome = homePrefix.toLowerCase().replace(/\\/g, "/");
    const isWindowsAbsolute = currentPath.includes(":");
    
    if (isWindowsAbsolute && normalizedPath.startsWith(normalizedHome)) {
      const relativePart = currentPath.substring(homePrefix.length);
      const parts = relativePart.split(separator).filter(Boolean);
      
      let accumulatedPath = homePrefix;
      
      return (
        <div className="breadcrumbs-container">
          <span 
            className="breadcrumb-item" 
            onClick={() => loadDirectory(homePrefix)}
          >
            ~ (Home)
          </span>
          {parts.map((part, index) => {
            accumulatedPath += separator + part;
            const currentAccumulated = accumulatedPath;
            const isLast = index === parts.length - 1;
            
            return (
              <span key={index} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="breadcrumb-sep"><IconChevronRight /></span>
                <span 
                  className={`breadcrumb-item ${isLast ? "active" : ""}`}
                  onClick={() => !isLast && loadDirectory(currentAccumulated)}
                >
                  {part}
                </span>
              </span>
            );
          })}
        </div>
      );
    }
    
    // Case 3: General Fallback (e.g. system drives like C:\, D:\)
    const parts = currentPath.split(separator).filter(Boolean);
    let accumulatedPath = isWindowsAbsolute ? "" : "";
    
    return (
      <div className="breadcrumbs-container">
        <span 
          className="breadcrumb-item" 
          onClick={() => loadDirectory(isWindowsAbsolute ? parts[0] + separator : "/")}
        >
          Root
        </span>
        {parts.map((part, index) => {
          if (isWindowsAbsolute && index === 0) {
            accumulatedPath = part + separator;
            return null; // Skip drive letter root
          }
          
          if (isWindowsAbsolute) {
            accumulatedPath += (index > 1 ? separator : "") + part;
          } else {
            accumulatedPath += "/" + part;
          }

          const currentAccumulated = accumulatedPath;
          const isLast = index === parts.length - 1;

          return (
            <span key={index} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span className="breadcrumb-sep"><IconChevronRight /></span>
              <span 
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
                onClick={() => !isLast && loadDirectory(currentAccumulated)}
              >
                {part}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`app-container theme-${theme} ${showJavaLab ? "lab-zen-mode" : ""} ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drop-zone-overlay">
          <div className="drop-zone-content">
            <div className="drop-zone-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" width="36" height="36">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <div className="drop-zone-title">Drop Files & Images Here</div>
            <div className="drop-zone-desc">Release to upload directly into the active directory</div>
          </div>
        </div>
      )}
      {/* Top Header - Hidden in Java Lab */}
      {!showJavaLab && (
        <header className="header-bar">
          {!showJavaLab && (
            <div className="logo-section">
              <button className="btn-icon sidebar-toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
                <IconMenu />
              </button>
              <div className="logo-icon">L</div>
              <div className="logo-text">LocalSpace</div>
            </div>
          )}
          
          {!showJavaLab && (
            <form onSubmit={handlePathSubmit}>
              <div className="path-config-input">
                <span>Root Path</span>
                <input 
                  type="text" 
                  value={pathInput} 
                  onChange={(e) => setPathInput(e.target.value)}
                  placeholder="e.g. C:\Users\Desktop"
                />
              </div>
            </form>
          )}

          <div className="theme-selector-container" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>THEME:</span>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="text-input"
              style={{ padding: "6px 12px", width: "120px", fontSize: "0.8rem", cursor: "pointer", background: "var(--bg-input)" }}
            >
              <option value="midnight">🌚 Midnight</option>
              <option value="alabaster">☀️ Alabaster</option>
              <option value="cyberpunk">🦄 Cyberpunk</option>
              <option value="emerald">🌲 Emerald</option>
            </select>
          </div>
        </header>
      )}

      {/* Editor Side Split View Wrapper */}
      <div className="workspace-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar-panel ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <div>
            <div 
              className="section-title-wrapper" 
              onClick={() => toggleSection("bookmarks")}
            >
              <span className="section-title">Quick Access Bookmarks</span>
              <span className={`collapse-icon ${collapsedSections.bookmarks ? "collapsed" : ""}`}>
                <IconChevronDown />
              </span>
            </div>
            
            <div className={`collapsible-section ${collapsedSections.bookmarks ? "collapsed" : ""}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {bookmarks.map((bookmark, idx) => (
                  <div 
                    key={idx}
                    className={`tree-node ${currentPath.toLowerCase() === bookmark.path.toLowerCase() ? "active" : ""}`}
                    onClick={() => loadDirectory(bookmark.path)}
                  >
                    <span style={{ opacity: 0.7, display: "flex", alignItems: "center" }}><IconBookmark /></span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {bookmark.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div 
              className="section-title-wrapper" 
              onClick={() => toggleSection("markdown")}
            >
              <div className="section-title">Markdown Files</div>
              <span className={`collapse-icon ${collapsedSections.markdown ? "collapsed" : ""}`}>
                <IconChevronDown />
              </span>
            </div>
            
            <div className={`collapsible-section ${collapsedSections.markdown ? "collapsed" : ""}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {items.filter(item => !item.isDir && item.name.toLowerCase().endsWith(".md")).length === 0 ? (
                  <div style={{ padding: "8px 10px", fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No markdown files in folder
                  </div>
                ) : (
                  items
                    .filter(item => !item.isDir && item.name.toLowerCase().endsWith(".md"))
                    .map((item, idx) => (
                      <div 
                        key={idx}
                        className={`tree-node ${editingFile?.path === item.path ? "active" : ""}`}
                        onClick={() => openFileInEditor(item)}
                      >
                        <span style={{ opacity: 0.7, display: "flex", alignItems: "center", color: "var(--primary)" }}><IconMarkdown /></span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </span>
                        {item.mdIndex !== undefined && (
                          <span className="badge" style={{ marginLeft: "auto", fontSize: "0.7rem", backgroundColor: "rgba(110, 68, 255, 0.15)", color: "var(--primary)", padding: "1px 6px", borderRadius: "10px" }}>
                            #{item.mdIndex}
                          </span>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div 
              className="section-title-wrapper" 
              onClick={() => toggleSection("labs")}
            >
              <div className="section-title">Labs & Tools</div>
              <span className={`collapse-icon ${collapsedSections.labs ? "collapsed" : ""}`}>
                <IconChevronDown />
              </span>
            </div>

            <div className={`collapsible-section ${collapsedSections.labs ? "collapsed" : ""}`}>
              <div 
                className={`tree-node ${showJavaLab ? "active" : ""}`}
                onClick={() => {
                  setShowJavaLab(true);
                  setEditingFile(null);
                }}
              >
                <span style={{ color: "#E1AD01", display: "flex", alignItems: "center" }}><IconJava /></span>
                <span>Java Lab Snippets</span>
                <span className="badge" style={{ marginLeft: "auto", fontSize: "0.7rem", backgroundColor: "rgba(225, 173, 1, 0.15)", color: "#E1AD01", padding: "1px 6px", borderRadius: "10px" }}>
                  {javaSnippets.length}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div 
              className="section-title-wrapper" 
              onClick={() => toggleSection("workspace")}
            >
              <div className="section-title">Snippet Patterns</div>
              <span className={`collapse-icon ${collapsedSections.workspace ? "collapsed" : ""}`}>
                <IconChevronDown />
              </span>
            </div>

            <div className={`collapsible-section ${collapsedSections.workspace ? "collapsed" : ""}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {snippetCategories.length === 0 ? (
                  <div style={{ padding: "8px 10px", fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No categorized snippets
                  </div>
                ) : (
                  snippetCategories.map((cat, idx) => (
                    <div 
                      key={idx}
                      className={`tree-node ${categoryFilter === cat.name && showJavaLab ? "active" : ""}`}
                      onClick={() => {
                        setShowJavaLab(true);
                        setCategoryFilter(cat.name);
                        setEditingFile(null);
                        setSelectedSnippet(null); // Clear selected snippet to show list
                      }}
                    >
                      <span style={{ opacity: 0.6, display: "flex", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                          <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span style={{ fontSize: "0.85rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.name}
                      </span>
                      <span style={{ 
                        fontSize: "0.7rem", 
                        backgroundColor: "rgba(255,255,255,0.06)", 
                        padding: "1px 6px", 
                        borderRadius: "10px",
                        color: "var(--text-muted)"
                      }}>
                        {cat.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Content Pane (with optional Side Editor) */}
        <div className={editingFile ? "editor-split-container" : ""}>
          {/* Main Explorer View */}
          <section className="explorer-main">
            {/* Breadcrumb Toolbar */}
            {!showJavaLab && (
              <div className="toolbar-bar">
                {renderBreadcrumbs()}

                <div className="action-buttons-group">
                  {/* Search field */}
                  <input 
                    type="text" 
                    className="text-input" 
                    style={{ padding: "6px 12px", width: "160px", fontSize: "0.8rem" }}
                    placeholder="Filter current view..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {/* Refresh */}
                  <button 
                    className="btn-icon" 
                    onClick={() => loadDirectory(currentPath)} 
                    title="Reload Directory"
                  >
                    <IconRefresh />
                  </button>

                  {/* View Mode Toggle */}
                  <button 
                    className="btn-icon" 
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    title={viewMode === "grid" ? "List View" : "Grid View"}
                  >
                    {viewMode === "grid" ? <IconList /> : <IconGrid />}
                  </button>

                  {/* New Folder */}
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setCreateModal({ isOpen: true, type: "folder" });
                      setNewItemName("");
                    }}
                  >
                    <IconPlus /> Folder
                  </button>

                  {/* New File */}
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setCreateModal({ isOpen: true, type: "file" });
                      setNewItemName("");
                    }}
                  >
                    <IconPlus /> File
                  </button>
                </div>
              </div>
            )}

            {/* Grid/List View Content or Java Lab */}
            <div className={`explorer-grid-container ${showJavaLab ? "lab-active" : ""}`}>
              {showJavaLab ? (
                /* JAVA LAB UI */
                <div className="java-lab-container">
                  <div className="lab-header">
                    <button className="btn-icon sidebar-toggle-btn" style={{ marginLeft: '4px' }} onClick={toggleSidebar} title="Toggle Sidebar">
                      <IconMenu />
                    </button>
                    <div className="lab-title-group">
                      <div className="lab-icon"><IconJava /></div>
                      <div>
                        <div className="lab-main-title">Java Code Snippets</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select 
                        value={theme} 
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="text-input"
                        style={{ padding: "6px 12px", width: "125px", fontSize: "0.8rem", cursor: "pointer", background: "var(--bg-input)" }}
                      >
                        <option value="midnight">🌚 Midnight</option>
                        <option value="alabaster">☀️ Alabaster</option>
                        <option value="cyberpunk">🦄 Cyberpunk</option>
                        <option value="emerald">🌲 Emerald</option>
                      </select>
                      <button className="btn-primary" onClick={handleCreateSnippet}>
                        <IconPlus /> New Snippet
                      </button>
                    </div>
                  </div>

                  <div className="lab-content-split">
                    {/* Left side list */}
                    <div className="lab-list-side">
                      {/* Level Filter */}
                      <div style={{ padding: "12px", borderBottom: "1px solid var(--glass-border)", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", width: "50px" }}>Level:</span>
                          <select 
                            className="text-input" 
                            style={{ padding: "4px 8px", fontSize: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text-primary)", borderRadius: "6px", outline: "none", cursor: "pointer", flex: 1 }}
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                          >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy (E)</option>
                            <option value="Medium">Medium (M)</option>
                            <option value="Hard">Hard (H)</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", width: "50px" }}>Pattern:</span>
                          <select 
                            className="text-input" 
                            style={{ padding: "4px 8px", fontSize: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text-primary)", borderRadius: "6px", outline: "none", cursor: "pointer", flex: 1 }}
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                          >
                            <option value="All">All Patterns</option>
                            {[...new Set(javaSnippets.map(s => s.category).filter(Boolean))].sort().map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {javaSnippets.filter(s => 
                        (levelFilter === "All" || s.level === levelFilter) &&
                        (categoryFilter === "All" || s.category === categoryFilter)
                      ).length === 0 ? (
                        <div className="lab-empty-list">
                          <p>
                            {levelFilter === "All" && categoryFilter === "All" 
                              ? "No snippets yet" 
                              : `No matching snippets found`}
                          </p>
                        </div>
                      ) : (
                        <div className="snippet-list">
                          {javaSnippets
                            .filter(snippet => 
                              (levelFilter === "All" || snippet.level === levelFilter) &&
                              (categoryFilter === "All" || snippet.category === categoryFilter)
                            )
                            .map(snippet => (
                            <div 
                              key={snippet.id} 
                              className={`snippet-item ${selectedSnippet?.id === snippet.id ? "active" : ""}`}
                              onClick={() => {
                                setSelectedSnippet(snippet);
                                setIsEditingSnippet(false);
                                setSnippetName(snippet.name);
                                setSnippetDescription(snippet.description || "");
                                setSnippetLevel(snippet.level || "Easy");
                                setSnippetCategory(snippet.category || "");
                                setSnippetCode(snippet.code);
                                setConsoleOutput(snippet.output || "");
                              }}
                            >
                              <div className="snippet-item-icon" style={{ position: "relative" }}>
                                <IconFile />
                                <span style={{ 
                                  position: "absolute", 
                                  bottom: "-4px", 
                                  right: "-4px", 
                                  fontSize: "0.6rem", 
                                  fontWeight: "800",
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: snippet.level === "Hard" ? "#ef4444" : snippet.level === "Medium" ? "#f59e0b" : "#10b981",
                                  color: "white",
                                  border: "2px solid var(--bg-card)"
                                }}>
                                  {(snippet.level || "E")[0]}
                                </span>
                              </div>
                              <div className="snippet-item-info">
                                <div className="snippet-item-name">{snippet.name}</div>
                                <div className="snippet-item-description" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {snippet.description || "No description"}
                                </div>
                                {snippet.category && (
                                  <div className="snippet-item-category" style={{ fontSize: "0.65rem", color: "rgba(225, 173, 1, 0.8)", marginTop: "2px", fontStyle: "italic" }}>
                                    {snippet.category}
                                  </div>
                                )}
                                <div className="snippet-item-meta" style={{ fontSize: "0.65rem", marginTop: "2px" }}>{formatDate(snippet.createdAt)}</div>
                              </div>
                              <button 
                                className="snippet-delete-btn"
                                onClick={(e) => handleDeleteSnippet(e, snippet.id)}
                              >
                                <IconTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right side display/editor */}
                    <div className="lab-view-side">
                      {selectedSnippet ? (
                        <div className="snippet-viewer">
                          <div className="snippet-viewer-header">
                            {isEditingSnippet ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                                <input 
                                  className="snippet-name-input" 
                                  style={{ width: "100%" }}
                                  value={snippetName}
                                  onChange={(e) => setSnippetName(e.target.value)}
                                  placeholder="Snippet Name"
                                />
                                <input 
                                  className="snippet-name-input" 
                                  style={{ width: "100%", fontSize: "0.8rem", borderStyle: "dashed" }}
                                  value={snippetDescription}
                                  onChange={(e) => setSnippetDescription(e.target.value)}
                                  placeholder="Brief description..."
                                />
                                <input 
                                  className="snippet-name-input" 
                                  style={{ width: "100%", fontSize: "0.8rem", borderStyle: "dotted" }}
                                  value={snippetCategory}
                                  onChange={(e) => setSnippetCategory(e.target.value)}
                                  placeholder="Category/Pattern (e.g. Sliding Window, Prefix Sum)"
                                  list="category-suggestions"
                                />
                                <datalist id="category-suggestions">
                                  {[...new Set(javaSnippets.map(s => s.category).filter(Boolean))].sort().map(cat => (
                                    <option key={cat} value={cat} />
                                  ))}
                                </datalist>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <div className="snippet-viewer-title">{selectedSnippet.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                  {selectedSnippet.description}
                                  {selectedSnippet.category && (
                                    <span style={{ marginLeft: "8px", color: "var(--text-accent)", fontWeight: "600" }}>
                                      • {selectedSnippet.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="snippet-viewer-actions">
                              {isEditingSnippet ? (
                                <>
                                  <select 
                                    className="snippet-name-input" 
                                    style={{ width: "auto", fontSize: "0.8rem" }}
                                    value={snippetLevel}
                                    onChange={(e) => setSnippetLevel(e.target.value)}
                                  >
                                    <option value="Easy">Easy (E)</option>
                                    <option value="Medium">Medium (M)</option>
                                    <option value="Hard">Hard (H)</option>
                                  </select>
                                  <button className="btn-secondary" onClick={() => setIsEditingSnippet(false)}>Cancel</button>
                                  <button className="btn-primary" onClick={handleSaveSnippet}>Save</button>
                                </>
                              ) : (
                                <>
                                  <button className="btn-icon" title="Copy Code" onClick={() => {
                                    navigator.clipboard.writeText(selectedSnippet.code);
                                    showToast("success", "Copied", "Code copied to clipboard");
                                  }}>
                                    <IconCopy />
                                  </button>
                                  <button className="btn-icon" title="Save to Active Workspace" onClick={handleExportSnippet}>
                                    <IconSave />
                                  </button>
                                  <button className="btn-secondary" onClick={() => setIsEditingSnippet(true)}>
                                    <IconEdit /> Edit
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="snippet-body">
                            {isEditingSnippet ? (
                              <textarea 
                                className="snippet-editor-textarea"
                                value={snippetCode}
                                onChange={(e) => setSnippetCode(e.target.value)}
                                spellCheck="false"
                              />
                            ) : (
                              <div className={`snippet-split-wrapper ${isConsoleCollapsed ? "console-hidden" : ""}`}>
                                <div className="syntax-highlighter-wrapper">
                                  <SyntaxHighlighter 
                                    language="java" 
                                    style={getSyntaxTheme()}
                                    customStyle={{
                                      margin: 0,
                                      padding: '20px',
                                      backgroundColor: 'transparent',
                                      fontSize: '0.9rem',
                                      borderRadius: '8px'
                                    }}
                                    showLineNumbers
                                  >
                                    {selectedSnippet.code}
                                  </SyntaxHighlighter>
                                </div>
                                <div className={`console-wrapper ${isConsoleCollapsed ? "collapsed" : ""}`}>
                                  <div 
                                    className="console-header"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span style={{ 
                                        display: "inline-flex", 
                                        transform: isConsoleCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                                        transition: "transform var(--transition-normal)",
                                        color: "var(--text-muted)"
                                      }}>
                                        <IconChevronDown />
                                      </span>
                                      <span className="console-title">Java Code Output</span>
                                    </div>
                                    {!isConsoleCollapsed ? (
                                      <div className="console-actions" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                          className="btn-primary-console"
                                          onClick={handleSaveSnippetOutput}
                                        >
                                          Save Output
                                        </button>
                                      </div>
                                    ) : (
                                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                        Click to Expand
                                      </span>
                                    )}
                                  </div>
                                  {!isConsoleCollapsed && (
                                    <div className="console-body-wrapper">
                                      <textarea 
                                        value={consoleOutput}
                                        onChange={(e) => setConsoleOutput(e.target.value)}
                                        placeholder="Type or paste the Java program output here..."
                                        className="console-full-textarea"
                                        spellCheck="false"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="lab-empty-view">
                          <IconJava />
                          <h3>Select a snippet to view code</h3>
                          <p>Or create a new one to start saving your Java snippets</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="empty-state">
                  <div className="empty-state-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="logo-icon" style={{ animation: "pulseGlow 2s infinite" }}>L</div>
                    Reading Filesystem...
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📂</div>
                  <div className="empty-state-title">No matching files found</div>
                  <div className="empty-state-desc">
                    {searchQuery ? `No files match "${searchQuery}"` : "This directory is empty or currently inaccessible."}
                  </div>
                  {!searchQuery && (
                    <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                      <button className="btn-secondary" onClick={() => loadDirectory("")}>
                        Go to Project Root
                      </button>
                      <button className="btn-primary" onClick={() => setCreateModal({ isOpen: true, type: "file" })}>
                        <IconPlus /> Create First File
                      </button>
                    </div>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                /* Grid Layout */
                <div className="grid-layout">
                  {filteredItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`file-card ${selectedItem?.path === item.path ? "selected" : ""} ${draggedOverFolder === item.path ? "drag-over" : ""}`}
                      onClick={() => handleFileClick(item)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      onDragOver={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      onDragEnter={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(item.path);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(null);
                        }
                      }}
                      onDrop={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(null);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            uploadFiles(e.dataTransfer.files, item.path);
                          }
                        }
                      }}
                    >
                      {/* Action buttons overlay */}
                      <div className="card-actions-overlay">
                        {!item.isDir && (
                          <>
                            <button 
                              className="btn-icon" 
                              style={{ padding: "4px", borderRadius: "4px" }}
                              title="Edit File"
                              onClick={(e) => {
                                e.stopPropagation();
                                openFileInEditor(item);
                              }}
                            >
                              <IconEdit />
                            </button>
                            <button 
                              className="btn-icon" 
                              style={{ padding: "4px", borderRadius: "4px" }}
                              title="Copy Content"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyFileContent(item);
                              }}
                            >
                              <IconCopy />
                            </button>
                          </>
                        )}
                        <button 
                          className="btn-icon" 
                          style={{ padding: "4px", borderRadius: "4px" }}
                          title="Rename"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameModal({ isOpen: true, item });
                            setRenameNewName(item.name);
                          }}
                        >
                          <IconRename />
                        </button>
                        <button 
                          className="btn-icon" 
                          style={{ padding: "4px", borderRadius: "4px", backgroundColor: "rgba(239, 68, 68, 0.15)", color: "hsl(350, 90%, 65%)" }}
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(item);
                          }}
                        >
                          <IconTrash />
                        </button>
                      </div>

                      {item.mdIndex !== undefined && (
                        <div className="md-index-badge">
                          #{item.mdIndex}
                        </div>
                      )}

                      <div className={`item-icon-wrapper ${item.isDir ? "folder" : "file"}`}>
                        {item.isDir ? <IconFolder /> : <IconFile />}
                      </div>

                      <div className="item-info">
                        <div className="item-name" title={item.name}>{item.name}</div>
                        <div className="item-details">
                          {item.isDir ? "Directory" : formatBytes(item.size)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List Layout */
                <div className="list-layout">
                  {filteredItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`file-list-item ${selectedItem?.path === item.path ? "selected" : ""} ${draggedOverFolder === item.path ? "drag-over" : ""}`}
                      onClick={() => handleFileClick(item)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      onDragOver={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      onDragEnter={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(item.path);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(null);
                        }
                      }}
                      onDrop={(e) => {
                        if (item.isDir) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraggedOverFolder(null);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            uploadFiles(e.dataTransfer.files, item.path);
                          }
                        }
                      }}
                    >
                      <div className="list-item-left">
                        <div className={`list-item-icon ${item.isDir ? "folder" : "file"}`}>
                          {item.isDir ? <IconFolder /> : <IconFile />}
                        </div>
                        <span className="item-name" style={{ fontSize: "0.9rem" }}>{item.name}</span>
                        {item.mdIndex !== undefined && (
                          <span className="md-index-badge-list">
                            #{item.mdIndex}
                          </span>
                        )}
                      </div>

                      <div className="list-item-details">
                        <span className="list-item-meta" style={{ textAlign: "left" }}>
                          {item.isDir ? "Folder" : formatBytes(item.size)}
                        </span>
                        <span className="list-item-meta" style={{ width: "130px" }}>
                          {formatDate(item.mtime)}
                        </span>
                        
                        {/* List actions */}
                        <div style={{ display: "flex", gap: "6px", marginLeft: "12px" }}>
                          {!item.isDir && (
                            <>
                              <button 
                                className="btn-icon" 
                                style={{ padding: "6px" }}
                                title="Edit File"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openFileInEditor(item);
                                }}
                              >
                                <IconEdit />
                              </button>
                              <button 
                                className="btn-icon" 
                                style={{ padding: "6px" }}
                                title="Copy Content"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyFileContent(item);
                                }}
                              >
                                <IconCopy />
                              </button>
                            </>
                          )}
                          <button 
                            className="btn-icon" 
                            style={{ padding: "6px" }}
                            title="Rename"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameModal({ isOpen: true, item });
                              setRenameNewName(item.name);
                            }}
                          >
                            <IconRename />
                          </button>
                          <button 
                            className="btn-icon" 
                            style={{ padding: "6px", backgroundColor: "rgba(239, 68, 68, 0.1) ", color: "hsl(350, 90%, 65%)" }}
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteResource(item);
                            }}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Code Editor Panel (renders side-by-side if editingFile is active) */}
          {editingFile && (
            <aside className="editor-side-panel">
              <div className="editor-header">
                <div className="editor-file-title">
                  <div className="editor-file-name">{editingFile.name}</div>
                  <div className="editor-file-path" title={editingFile.path}>{editingFile.path}</div>
                </div>
                {editingFile.name.toLowerCase().endsWith(".md") && (
                  <div className="editor-tabs" style={{ marginRight: "12px" }}>
                    <button 
                      className={`editor-tab ${editorMode === "preview" ? "active" : ""}`}
                      onClick={() => setEditorMode("preview")}
                    >
                      Preview
                    </button>
                    <button 
                      className={`editor-tab ${editorMode === "edit" ? "active" : ""}`}
                      onClick={() => setEditorMode("edit")}
                    >
                      Edit
                    </button>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button 
                    className="btn-icon" 
                    title="Copy to Clipboard"
                    onClick={copyEditorContent}
                    style={{ padding: "6px" }}
                  >
                    <IconCopy />
                  </button>
                  <button 
                    className="btn-icon"
                    style={{ border: "none", background: "transparent" }}
                    onClick={() => setEditingFile(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="editor-textarea-wrapper">
                {editingFile.name.toLowerCase().endsWith(".md") && editorMode === "preview" ? (
                  <div className="markdown-preview-container">
                    <MarkdownRenderer content={editorContent} syntaxTheme={getSyntaxTheme()} />
                  </div>
                ) : (
                  <textarea 
                    className="editor-textarea" 
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    spellCheck="false"
                    placeholder="Start writing text/code content..."
                  />
                )}
              </div>

              <div className="editor-footer">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Character count: {editorContent.length}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setEditingFile(null)}
                    disabled={isSavingFile}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={saveFileContent}
                    disabled={isSavingFile}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <IconSave /> {isSavingFile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* CREATE RESOURCE MODAL */}
      {createModal.isOpen && (
        <div className="modal-overlay" onClick={() => setCreateModal({ isOpen: false, type: "file" })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New {createModal.type === "file" ? "File" : "Folder"}</div>
              <button 
                className="btn-icon" 
                style={{ border: "none", background: "transparent" }}
                onClick={() => setCreateModal({ isOpen: false, type: "file" })}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateResource}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={createModal.type === "file" ? "e.g. notes.txt" : "e.g. projects"}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setCreateModal({ isOpen: false, type: "file" })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create {createModal.type === "file" ? "File" : "Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME RESOURCE MODAL */}
      {renameModal.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameModal({ isOpen: false, item: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Rename Resource</div>
              <button 
                className="btn-icon" 
                style={{ border: "none", background: "transparent" }}
                onClick={() => setRenameModal({ isOpen: false, item: null })}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRenameResource}>
              <div className="modal-body">
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Renaming: <code style={{ color: "var(--text-secondary)" }}>{renameModal.item?.name}</code>
                </div>
                <div className="form-group">
                  <label>New Name</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    value={renameNewName}
                    onChange={(e) => setRenameNewName(e.target.value)}
                    placeholder="Enter new name..."
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setRenameModal({ isOpen: false, item: null })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Apply Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOASTS PORTAL */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-desc">{t.desc}</div>
            </div>
            <div className="toast-close" onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}>
              ✕
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
