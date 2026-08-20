import "../App.css";

export function AcademyRequestLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="page-loader academy-request-loader" role="status" aria-live="polite">
      <span className="page-loader-mark" aria-hidden="true">A</span>
      <span className="page-loader-spinner" aria-hidden="true" />
      <span className="sr-only">Processing your request</span>
    </div>
  );
}
