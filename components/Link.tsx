import { default as NextLink, LinkProps } from 'next/link'

export function Link({ as, href, ...otherProps }: React.PropsWithChildren<LinkProps>) {
  return (
    <NextLink as={as} href={href}>
      <a className="text-blue-400" {...otherProps} />
    </NextLink>
  )
}
