import { StyledLink } from "../common/link";
import { WrtnlabsLogo } from "../icons/WrtnlabsLogo";

const FOOTER_CONTENTS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "https://wrtnlabs.io/about/" },
      { label: "Blog", href: "https://wrtnlabs.io/blog/" },
      // MEMO: Toast 팝업
      { label: "Agent OS", href: "https://wrtnlabs.io/" },
      { label: "Youtube", href: "https://www.youtube.com/@wrtnlabs" }
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Agentica", href: "https://wrtnlabs.io/agentica/" },
      { label: "Autoview", href: "https://wrtnlabs.io/autoview/" },
      { label: "Github", href: "https://github.com/wrtnlabs" },
      { label: "Docs", href: "https://wrtnlabs.io/agentica/docs/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="grid grid-cols-2 md:grid-cols-4 md:h-[484px] bg-zinc-900 px-4 md:px-16 py-32 md:pb-10 md:pt-24">
      <div className="hidden md:flex flex-col h-full justify-between">
        <WrtnlabsLogo className="h-7 w-32" />
        <p className="text-zinc-600 text-sm">© 2025 Wrtn Labs</p>
      </div>
      <div className="hidden md:block" />
      {FOOTER_CONTENTS.map(({ title, links }) => (
        <nav key={title} className="flex md:pl-6 flex-col gap-6 md:gap-3">
          <p className="text-sm md:text-lg text-gray-50">{title}</p>
          <div className="flex flex-col gap-6">
            {links.map(({ label, href }) => (
              <StyledLink key={label} href={href} target="_blank">
                {label}
              </StyledLink>
            ))}
          </div>
        </nav>
      ))}
    </footer>
  );
}
