interface LoadingProps {
  label: string;
}

// Fills the space under the header while a page's data loads. It fades in
// after a short delay, so a fast or cached load doesn't flash a spinner.
const Loading = ({ label }: LoadingProps) => (
  <main
    role="status"
    className="grow flex flex-col items-center justify-center gap-4 p-4 text-secondaryDarkFontColor motion-safe:animate-delayedFadeIn"
  >
    <span
      aria-hidden
      className="h-10 w-10 rounded-full border-4 border-borderDarkFontColor border-t-redCorner border-b-blueCorner motion-safe:animate-spin"
    />
    <p>{label}</p>
  </main>
);

export default Loading;
