const R = require("ramda");
const {ul, html, escapeHtml, localizer, slugify, heading, renderMarkdownInline} = require("../components");

const localizations = localizer({
  thanksHeadingText: {
    en: "Acknowledgements",
    es: "Agradecimientos"
  },
  intro: {
    en: "Thanks to the following individuals for their research or contributions to this topic:",
    es: "Gracias a las siguientes personas por sus investigaciones o contribuciones a este tema:"
  }
});

module.exports = async function(ctx) {
  const {page, lang} = ctx;
  const localize = localizations(lang);

  const thanksEntries = Object.entries(R.pipe(
    R.propOr({}, "thanks"),
    R.mapObjIndexed((forLangs, to) => forLangs[lang] ? [forLangs[lang]] : [])
  )(page));

  if (thanksEntries.length == 0) {
    return {};
  }

  const thanksHeadingText = localize("thanksHeadingText")
  thanksEntries.sort(([aTo], [bTo]) => aTo.localeCompare(bTo));

  return {
    headings: [{level: 1, id: slugify(thanksHeadingText), title: thanksHeadingText}],
    html: html`
      ${heading("h1", thanksHeadingText)}
      <p>${localize("intro")}</p>
      ${ul(thanksEntries.map(([to, forEntries]) => {
        const forPart = forEntries.length > 0 ? ` <em>(${renderMarkdownInline(ctx, forEntries.join("; "))})</em>` : "";
        return `${escapeHtml(to)}${forPart}`;
      }))}
    `
  };
};
