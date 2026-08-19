import { LegalContent, LegalHero, LegalPage as Page } from "./Legal.styles";

function LegalPage({ title, intro, sections }) {
  return (
    <Page>
      <LegalHero>
        <h1>{title}</h1>
        <p>{intro}</p>
      </LegalHero>
      <LegalContent>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.body && <p>{section.body}</p>}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </LegalContent>
    </Page>
  );
}

export default LegalPage;
