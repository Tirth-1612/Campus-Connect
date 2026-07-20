export default function SelectInput({ label, children, ...props }){
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className="form-input" {...props}>{children}</select>
    </div>
  );
}
