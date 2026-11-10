import React from 'react';
export default function Link({ href, children, ...rest }: any) {
  const h = typeof href === 'string' && href.startsWith('/') ? `?r=${encodeURIComponent(href)}` : href;
  return <a href={h} {...rest}>{children}</a>;
}
