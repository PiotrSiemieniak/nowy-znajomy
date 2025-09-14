const SKELETON_SX =
  "animate-pulse bg-gradient-to-b from-muted to-transparent min-w-72 w-72 h-54 rounded-lg";

export function Skeleton() {
  return (
    <>
      <div className={SKELETON_SX} style={{ animationDelay: "0ms" }} />
      <div className={SKELETON_SX} style={{ animationDelay: "100ms" }} />
      <div className={SKELETON_SX} style={{ animationDelay: "200ms" }} />
    </>
  );
}
