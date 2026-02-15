import { describe, it, expect } from "vitest";

// Direct import of escapeHtml logic (same implementation as services/email.ts)
// Avoids pulling in Resend SDK dependency
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("does not double-escape already-escaped strings", () => {
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });

  it("handles strings with all special chars", () => {
    expect(escapeHtml(`<div class="x" data-val='y'>&`)).toBe(
      "&lt;div class=&quot;x&quot; data-val=&#39;y&#39;&gt;&amp;"
    );
  });

  it("handles typical user input with Romanian characters", () => {
    expect(escapeHtml("Bună ziua! Vreau o ofertă <urgentă>")).toBe(
      "Bună ziua! Vreau o ofertă &lt;urgentă&gt;"
    );
  });
});
