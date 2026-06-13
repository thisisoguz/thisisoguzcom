import { Button } from "@/components/Button";

export default function NotFound() {
  return <main className="not-found"><div><p className="eyebrow">404</p><h1>Nothing here.</h1><p>The page may have moved, or it may not exist yet. If you were looking for the CV, it has not been added to the site.</p><Button href="/">Return home</Button></div></main>;
}
