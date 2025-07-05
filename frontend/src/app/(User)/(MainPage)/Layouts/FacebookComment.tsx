// components/FacebookComments.tsx
'use client'; // if using Next.js App Router

import { useEffect } from 'react';

interface FacebookCommentsProps {
  url: string;
  width?: string;
  numPosts?: number;
}


export default function FacebookComments({ url, width = '100%', numPosts = 5 }: FacebookCommentsProps) {
  useEffect(() => {
    // Load SDK only once

    const APP_ID=process.env.NEXT_PUBLIC_FACEBOOK_APPID
    
    if (typeof window !== 'undefined' && !window.FB) {
      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = `https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v22.0&appId=${APP_ID}`;
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    } else {
      window.FB?.XFBML.parse(); // re-render plugin if FB SDK already loaded
    }
  }, [url]); // re-run if URL changes (important for dynamic routing)

  return (
    <>
      <div id="fb-root" />
      <div
        className="fb-comments"
        data-href={url}
        data-width={width}
        data-numposts={numPosts}
      />
    </>
  );
}
