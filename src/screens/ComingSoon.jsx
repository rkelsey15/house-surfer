// Stand-in for screens that are built in later steps.
export default function ComingSoon({ title, children }) {
  return (
    <div className="coming">
      <h1>{title}</h1>
      <p className="muted">{children}</p>
    </div>
  )
}
