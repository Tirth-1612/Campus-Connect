export default function PasswordInput({ label, ...props }){
  return (
    <label className="field">
      <span className="label-muted">{label}</span>
      <input type="password" className="input" {...props} />
    </label>
  );
}
