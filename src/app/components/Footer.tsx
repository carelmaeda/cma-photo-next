
"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer bg-light">
      <div className="container text-muted">
          <h6>Thank you for your interest in my work!</h6>
          <div>
          <small className="d-block">This portfolio was <a target="_blank" href="https://www.figma.com/design/vINdCUCFAALYVx9bto0Nq5/CMA-Portfolio?node-id=75-2169&t=SgGC9GVQ7sCtWpMG-1">designed</a> in Figma and <a target="_blank" href="https://github.com/carelmaeda/cma-next.git">developed</a> with Next.js, TypeScript, and Bootstrap.</small>
          <small>&copy; {year ? year : ""} Carel Maeda. All rights reserved.</small>
          </div>
      </div>
    </footer>
  );
}

