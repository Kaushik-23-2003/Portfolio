const site_url =
  process.env.NEXT_PUBLIC_APP_URL || "https://the-portfolio-lac.vercel.app";

export const siteConfig = {
  name: "Kaushik | Portfolio",
  description:
    "Personal portfolio website showcasing my projects and skills as a full stack developer",
  url: site_url,
  ogImage: `${site_url}/_static/og-image.png`,
  links: {
    twitter: "https://x.com/i_Kaushik_03",
    github: "https://github.com/Kaushik-23-2003",
  },
  mailSupport: "kaushikhariharan2003@gmail.com",
};
