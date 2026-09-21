# Huiwen UI font subset

Source: Huiwen-mincho (汇文明朝体), version 1.00, January 14, 2021.
Original font metadata copyright notice: Public Domain.
User-selected source stylesheet:
https://ik.imagekit.io/chinesefonts7/packages/hwmct/dist/汇文明朝体/result.css

`huiwen-ui-v1.woff2` is a subset of the original font, retaining the text used in app/ and lib/ (including all daily prompts) at the time of generation. Original naming and license metadata are preserved. Generated with fontTools merge and subset. Characters outside the subset use the existing local serif fallback.

The font is preloaded from the website's own origin, uses font-display: optional, and is never injected after mount. A slow first visit retains the fallback font for that render instead of swapping visible text. Future UI wording changes should regenerate and version this subset. No third-party font request is required at runtime.
