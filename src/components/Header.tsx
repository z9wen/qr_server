function Header() {
  return (
    <header className="flex items-center justify-between border-b border-line py-5 sm:py-6">
      <a className="flex items-center gap-3 text-lg font-bold tracking-[-0.03em] text-forest" href="/" aria-label="QR Server home">
        <span className="grid size-9 grid-cols-2 gap-1 rounded-xl bg-forest p-2" aria-hidden="true">
          <i className="rounded-[2px] bg-lime" />
          <i className="rounded-[2px] bg-white" />
          <i className="col-span-2 rounded-[2px] bg-leaf" />
        </span>
        QR Server
      </a>
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-leaf sm:text-sm">
        <i className="size-2 rounded-full bg-lime shadow-[0_0_0_4px_rgba(185,239,131,0.25)]" />
        Edge service online
      </span>
    </header>
  )
}

export default Header
