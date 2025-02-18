import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <title>Orbiting</title>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <script
                    src="https://tinylytics.app/embed/ezMr4h65sCPevsfzK4ed.js"
                    defer
                ></script>
                {/* Link the PWA manifest file. */}
                <link rel="manifest" href="/manifest.json" />

                {/* Bootstrap the service worker. */}
                <script dangerouslySetInnerHTML={{ __html: sw }} />

                {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
                <ScrollViewStyleReset />

                {/* Add any additional <head> elements that you want globally available on web... */}
                <meta property="og:image" content="https://orbiting.com/imgs/og.png" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:type" content="website" />
            </head>
            <body>{children}</body>
        </html>
    );
}

const sw = `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
`;
