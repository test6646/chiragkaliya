import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="cap">Frame not found</p>
        <h1 className="display mt-4 text-7xl text-ink">404</h1>
        <p className="mt-4 text-sm text-ink-mute">
          The frame you're looking for has been cut from the reel.
        </p>
        <div className="mt-8">
          <Link to="/" className="cap cap-ink underline underline-offset-8 decoration-ink/40">
            ← Return to reel
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="cap">Reel interrupted</p>
        <h1 className="display mt-4 text-4xl text-ink">Something fell out of frame.</h1>
        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="cap cap-ink underline underline-offset-8 decoration-ink/40"
          >
            Try again
          </button>
          <a href="/" className="cap underline underline-offset-8 decoration-ink-mute/40">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chirag Kaliya — Cinematographer & Director of Photography" },
      {
        name: "description",
        content:
          "Selected works of Chirag Kaliya — cinematographer & director of photography. A study in light, stillness and memory.",
      },
      { name: "author", content: "Chirag Kaliya" },
      { property: "og:title", content: "Chirag Kaliya — Cinematographer" },
      {
        property: "og:description",
        content: "A cinematography journal. Selected films, color, motion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
