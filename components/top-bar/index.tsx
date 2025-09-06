import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent
} from '@heroui/navbar';
import NextLink from 'next/link';
import { memo } from 'react';
import { SearchModal } from '../search-modal';

const Topbar = memo(() => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="px-2">
      <NavbarContent className="hidden sm:flex flex-1 basis-0" justify="start">
        <NavbarBrand className="gap-3">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span className="text-xl font-bold">OsGatos.net</span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="flex flex-1 basis-0 justify-center sm:justify-center sm:flex"
        justify="center"
      >
        <SearchModal />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex flex-1 basis-0" justify="end" />
    </HeroUINavbar>
  );
});
Topbar.displayName = 'Topbar';

export { Topbar };
