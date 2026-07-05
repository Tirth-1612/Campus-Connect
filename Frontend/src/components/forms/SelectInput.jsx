export default function SelectInput({ label, children, ...props }){
  return (
    <label className="field">
      <span className="label-muted">{label}</span>
      <select className="select" {...props}>{children}</select>
    </label>
  );
}
