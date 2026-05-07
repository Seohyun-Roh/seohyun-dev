declare module 'highlightjs-svelte' {
  import type { HLJSApi } from 'highlight.js';
  const register: (hljs: HLJSApi) => void;
  export default register;
}
