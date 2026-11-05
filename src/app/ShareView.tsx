import { useRef, useState } from "react";
import { type AppRoute, appHref } from "./routes";

/** Copies the public reading location; browser permission failures get a selectable fallback. */
export function ShareView({ route }: { route: AppRoute }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const share = async () => {
    const location = new URL(window.location.href);
    location.search = "";
    location.hash = appHref(route);
    try {
      await navigator.clipboard.writeText(location.href);
      setMessage("Chapter link copied.");
    } catch {
      setUrl(location.href);
      dialog.current?.showModal();
      requestAnimationFrame(() => {
        input.current?.focus();
        input.current?.select();
      });
    }
  };
  return (
    <div className="app-share">
      <button type="button" data-focus="share-view" onClick={share}>
        Share view
      </button>
      <span role="status">{message}</span>
      <dialog ref={dialog} aria-labelledby="share-title">
        <h2 id="share-title">Copy chapter link</h2>
        <p>
          Only the chapter location is shared. A fresh document opens its
          default scene.
        </p>
        <label htmlFor="share-url">Chapter URL</label>
        <input
          ref={input}
          id="share-url"
          value={url}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
        <form method="dialog">
          <button type="submit">Close</button>
        </form>
      </dialog>
    </div>
  );
}
