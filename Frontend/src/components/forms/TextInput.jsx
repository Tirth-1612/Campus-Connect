export default function TextInput({ label, ...props }){
  return (
    <label className="field">
      <span className="label-muted">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}
