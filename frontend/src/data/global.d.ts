export {}; // mark this as a module

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
      // Add more FB SDK typings if needed
    };
  }
}
