import { useEffect, useRef, useState } from "react";

export function useAttributeObserver<Element extends HTMLElement>(
  attributeKey: string,
) {
  const [attributes, setAttributes] = useState<string | null>();
  const ref = useRef<Element>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          setAttributes(mutation.target.getAttribute(attributeKey));
        }
      });
    });

    if (ref.current) {
      observer.observe(ref.current, {
        attributes: true,
        attributeFilter: [attributeKey],
      });

      // Set initial attributes
      setAttributes(ref.current.getAttribute(attributeKey));
    }

    return () => observer.disconnect();
  }, [attributeKey]);

  return [ref, attributes] as const;
}
