import Link from 'next/link';

export function MobileMenuSection({
  title,
  items,
  titleHref,
  setOpen,
}: {
  title: string;
  titleHref?: string;
  items?: { title: string; href: string; description: string }[] | null;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="space-y-3 p-4">
      <h3 className="font-semibold text-lg">
        {titleHref ? (
          <Link href={titleHref} onClick={() => setOpen(false)}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <div className="space-y-2">
        {items?.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="font-medium text-sm">{item.title}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
