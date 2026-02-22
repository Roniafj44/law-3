## 2025-02-12 - Critical XSS in Chat Area
**Vulnerability:** The `ChatArea` component was rendering user messages using `dangerouslySetInnerHTML` without sanitization. This allowed attackers to inject malicious scripts (XSS).
**Learning:** `dangerouslySetInnerHTML` should never be used with unsanitized user input. Even if the input is processed (like adding HTML tags), the original user content must be sanitized.
**Prevention:** Use `dompurify` to sanitize HTML content before passing it to `dangerouslySetInnerHTML`. Prefer CSS classes over inline styles to allow stricter sanitization rules (e.g., stripping `style` attributes).
