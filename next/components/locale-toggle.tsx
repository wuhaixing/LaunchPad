import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/elements/dropdown-menu"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { i18n } from '@/i18n.config'
import { Button } from "@/components/elements/button";
import Flag from 'react-world-flags';

export function LocaleToggle() {
  const pathName = usePathname()
  const currentLocale = pathName.split('/')[1]

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }
  const localFlag = (locale: string) => {
    const flagCode = locale === 'en' ? 'GB' : locale;
    return <Flag code={ flagCode } />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {localFlag(currentLocale)}
          <span className="sr-only">Toggle locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
      {i18n.locales.map((locale) => (
        <DropdownMenuItem key={locale}>
          <Link
            href={redirectedPathName(locale)}
          >            
            {localFlag(locale)}            
          </Link>
          </DropdownMenuItem>
      ))}
      </DropdownMenuContent>
    </DropdownMenu>
    
  );
}

