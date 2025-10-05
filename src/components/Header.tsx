import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <Link href="/">
              <h1>SMP Treatment</h1>
            </Link>
          </div>
          <ul className="nav-menu">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
