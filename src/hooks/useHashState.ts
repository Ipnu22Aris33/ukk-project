import { useEffect, useRef, useState } from "react";

/**
 * Generic hash-based state hook
 * - Type-safe
 * - Sync with URL hash
 * - React friendly
 *
 * Example:
 * const TABS = ["login", "register"] as const;
 * const [tab, setTab] = useHashState(TABS, "login");
 */
export function useHashState<T extends readonly string[]>(
  allowedValues: T,
  defaultValue: T[number],
  options?: {
    replace?: boolean; // use history.replaceState instead of push
    syncOnMount?: boolean; // read hash on mount
  }
) {
  const { replace = false, syncOnMount = true } = options || {};
  const isMounted = useRef(false);

  const getValidHash = (): T[number] => {
    const hash = window.location.hash.slice(1);
    return allowedValues.includes(hash as T[number]) ? (hash as T[number]) : defaultValue;
  };

  const [state, setState] = useState<T[number]>(() => (syncOnMount ? getValidHash() : defaultValue));

  // Sync hash → state
  useEffect(() => {
    const onHashChange = () => {
      setState(getValidHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [allowedValues]);

  // Sync state → hash
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const newHash = `#${state}`;

    if (replace) {
      history.replaceState(null, "", newHash);
    } else {
      window.location.hash = state;
    }
  }, [state, replace]);

  return [state, setState] as const;
}
