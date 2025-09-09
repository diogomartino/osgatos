import { Navbar, NavbarBrand, NavbarContent } from '@heroui/navbar';
import Link from 'next/link';
import { memo } from 'react';
import { SearchModal } from '../search-modal';

const Topbar = memo(() => {
  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <Link className="font-bold text-xl" href="/">
            OsGatos.net
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center">
        <SearchModal />
      </NavbarContent>

      <NavbarContent justify="end" />
    </Navbar>
  );
});

Topbar.displayName = 'Topbar';

export { Topbar };
