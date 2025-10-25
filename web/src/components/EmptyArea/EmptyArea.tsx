import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { DicesIcon } from 'lucide-react';
export default function EmptyArea({
  children,
  title,
  message,
  className,
  icon,
}: {
  children?: React.ReactNode;
  title?: string;
  message?: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Empty
      className={`mx-auto w-full px-0 rounded-2xl ${
        className ? className : 'max-w-2xl'
      }`}
    >
      <EmptyHeader className="max-w-2xl">
        <EmptyMedia variant="icon">{icon || <DicesIcon />}</EmptyMedia>
        <EmptyTitle className="text-2xl">{title || 'Zona vietata'}</EmptyTitle>
        <EmptyDescription className="text-lg px-8">
          {message || 'Non hai i permessi per visualizzare questa pagina.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mt-4">{children}</EmptyContent>
    </Empty>
  );
}
