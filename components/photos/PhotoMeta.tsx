export function PhotoMeta({ location, takenAtLabel, className = "" }: { location: string; takenAtLabel: string; className?: string }) {
  return (
    <div className={`photo-meta ${className}`.trim()}>
      <p className="photo-meta-location">{location}</p>
      <p className="photo-meta-date">{takenAtLabel}</p>
    </div>
  );
}
