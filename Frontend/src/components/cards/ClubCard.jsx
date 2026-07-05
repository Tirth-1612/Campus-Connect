export default function ClubCard({ club, onJoin }){
  const status = club.membership_status || club.status || club.joinState || null;

  let label = 'Join';
  let disabled = false;
  let ghost = false;
  if (status === 'pending') { label = 'Pending'; disabled = true; }
  else if (status === 'approved') { label = 'Accepted'; disabled = true; }
  else if (status === 'rejected') { label = 'Rejected'; disabled = true; ghost = true; }

  function handleJoin(){
    if (disabled) return;
    onJoin && onJoin(club);
  }

  return (
    <div className="card stack">
      <img className="media" src={club.image_url || 'https://via.placeholder.com/640x240'} alt="club" />
      <div className="flex-row">
        <div>
          <div className="card-title">{club.name}</div>
          <div className="card-subtle">{club.description}</div>
        </div>
        {onJoin && (
          <button className={`btn ${ghost ? 'ghost' : ''}`} disabled={disabled} onClick={handleJoin}>{label}</button>
        )}
      </div>
    </div>
  );
}
