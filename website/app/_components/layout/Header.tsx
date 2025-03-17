import Link from "next/link";

import { Tabs, TabsList, TabsTrigger } from "../common/tabs";
import { headers } from "next/headers";
import { ArrowUpRight, MenuIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../common/dropdown-menu";
import { Button } from "../common/button";

export default async function Header() {
  const headerList = await headers();
  const pathname = headerList.get("x-forwarded-pathname") ?? "";

  return (
    <>
      {/* Desktop */}
      <header className="sticky top-0 z-50 hidden w-full justify-center bg-linear-to-t to-[#030303]/50 pt-5 md:flex">
        <Tabs defaultValue={pathname}>
          <TabsList>
            <Link href="/agentica">
              <TabsTrigger value="/agentica">Agentica</TabsTrigger>
            </Link>
            <Link href="/autoview">
              <TabsTrigger value="/autoview">Autoview</TabsTrigger>
            </Link>
            <Link href="https://wrtnlabs.io/" target="_blank">
              <TabsTrigger value="/">
                Agent OS <ArrowUpRight />
              </TabsTrigger>
            </Link>
            <Link href="https://wrtnlabs.io/blog-overview" target="_blank">
              <TabsTrigger value="/">
                Blog <ArrowUpRight />
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </header>
      {/* Mobile */}
      <header className="sticky top-0 z-50 flex w-full justify-end px-5 pt-5 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-10 w-10 rounded-md">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-gray-800 bg-zinc-900"
          >
            <Link href="/agentica">
              <DropdownMenuItem className="text-zinc-50! hover:bg-zinc-700!">
                Agentica
              </DropdownMenuItem>
            </Link>
            <Link href="/autoview">
              <DropdownMenuItem className="text-zinc-50! hover:bg-zinc-700!">
                Autoview
              </DropdownMenuItem>
            </Link>
            <Link href="https://wrtnlabs.io/" target="_blank">
              <DropdownMenuItem className="text-zinc-50! hover:bg-zinc-700!">
                Agent OS
                <ArrowUpRight className="text-zinc-50" />
              </DropdownMenuItem>
            </Link>
            <Link href="https://wrtnlabs.io/blog-overview" target="_blank">
              <DropdownMenuItem className="text-zinc-50! hover:bg-zinc-700!">
                Blog
                <ArrowUpRight className="text-zinc-50" />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
}
