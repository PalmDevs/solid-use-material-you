# solid-create-material-theme

**This is a fork of [`use-material-you` by @maiconcarraro](https://github.com/maiconcarraro/use-material-you).**

Solid.js hook to create dynamic schemes and variants based on [material-foundation/material-color-utilities](https://github.com/material-foundation/material-color-utilities). Inspired by [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).

The goal is to simplify the usage, already returning HEX values to immediately usage and supporting HEX, RGBA and URL.

It supports all [main variants](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme) from `material-color-utilities`. Plus a new variant named `image-fidelity` that is going to use the top 3 dominant colors from the image, dedicated to situations where you want to create beautiful gradients, inspired by [color-thief](https://github.com/lokesh/color-thief/).

## Install

```
npm install solid-create-material-theme
```

## Usage

From a HEX color:

```jsx
const [scheme] = createMaterialTheme("#7C3AED", {
  variant: "tonal_spot",
  isDark: false,
  contrastLevel: "standard",
});

return (
  <Box style={{ background: scheme.primary, color: scheme.onPrimary }}>
    Primary
  </Box>
);
```
From a RGBA color:

```jsx
const [scheme] = createMaterialTheme("rgba(124, 58, 237, 0.5)", {
  variant: "fidelity",
  dark: true,
  contrastLevel: "medium",
});

// ...
```

From an image URL:

```tsx
const [scheme, state] = createMaterialTheme(
  "https://uploads.sitepoint.com/wp-content/uploads/2021/04/1618197067vitejs.png",
  {
    variant: "image_fidelity", // new variant to use top 3 dominant colors from image
  },
);

// ...
```

## Example

You can view the example by running `npm run preview` after cloning the project and running `npm install`. The source code for the example is in the [`example`](./example) directory.

## Variants

| Name             | Description |
| ---------------- | ----------- |
| "tonal_spot"     | Default for Material theme colors. Builds pastel palettes with a low chroma. |
| "fidelity"       | The resulting color palettes match seed color, even if the seed color is very bright (high chroma). |
| "monochrome"     | All colors are grayscale, no chroma. |
| "neutral"        | Close to grayscale, a hint of chroma. |
| "vibrant"        | Pastel colors, high chroma palettes. The primary palette's chroma is at maximum. Use `fidelity` instead if tokens should alter their tone to match the palette vibrancy. |
| "expressive"     | Pastel colors, medium chroma palettes. The primary palette's hue is different from the seed color, for variety.
| "content"        | Almost identical to `fidelity`. Tokens and palettes match the seed color. `primaryContainer` is the seed color, adjusted to ensure contrast with surfaces. The tertiary palette is analogue of the seed color. |
| "rainbow"        | A playful theme - the seed color's hue does not appear in the theme. |
| "fruit_salad"    | A playful theme - the seed color's hue does not appear in the theme. |
| "image_fidelity" | Not an official variant, custom made. It extracts top 3 dominant colors and set as primary, secondary and tertiary palettes. |
