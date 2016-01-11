# Fonts

The `gmf-icons` symbols font can be extended with new icons.

In order to do so, you can add new glyphs to the `svg` file.

Then the `.ttf`, `.woff` and `.eot` files should be generated with the
following commands:

```
node_modules/svg2ttf/svg2ttf.js contribs/gmf/fonts/gmf-icons.svg contribs/gmf/fonts/gmf-icons.ttf
node_modules/ttf2eot/ttf2eot.js contribs/gmf/fonts/gmf-icons.ttf contribs/gmf/fonts/gmf-icons.eot
node_modules/ttf2woff/ttf2woff.js contribs/gmf/fonts/gmf-icons.ttf contribs/gmf/fonts/gmf-icons.woff
```
