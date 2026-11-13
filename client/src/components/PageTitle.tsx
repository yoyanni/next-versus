import Head from "next/head";

export const SITE_NAME = "Versus 4";

interface PageTitleProps {
  // Left out on the home page, which shows the site name alone
  title?: string;
}

// Every page renders one of these in every branch, its loading state included.
// Don't add a default title in _app or Layout: next/head keeps only one
// <title>, and which of two wins differs between the server and the client.
const PageTitle = ({ title }: PageTitleProps) => (
  <Head>
    <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
  </Head>
);

export default PageTitle;
