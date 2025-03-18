import { StyledLink } from "../common/link";
import { WrtnlabsLogo } from "../icons/WrtnlabsLogo";

const FOOTER_CONTENTS = [
  {
    title: "Developers",
    links: [
      { label: "Github", href: "https://github.com/wrtnlabs" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "Wrtn Labs", href: "https://wrtnlabs.io/" }],
  },
];

export default function Footer() {
  return (
    <footer className="z-10 flex h-64 justify-between bg-zinc-900 px-16 py-8">
      <WrtnlabsLogo className="h-7 w-7 md:h-18 md:w-18" />
      <div className="flex gap-16">
        {FOOTER_CONTENTS.map(({ title, links }) => (
          <nav key={title} className="flex flex-col gap-2 md:gap-3">
            <p className="text-sm text-zinc-600 md:text-[21px]">{title}</p>
            {links.map(({ label, href }) => (
              <StyledLink key={label} href={href} target="_blank">
                {label}
              </StyledLink>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
