import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { DicesIcon } from 'lucide-react';
export default function ForbiddenArea({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Empty className="mx-auto w-full max-w-2xl px-0">
      <EmptyHeader className="max-w-2xl">
        <EmptyMedia variant="icon">
          <DicesIcon />
        </EmptyMedia>
        <EmptyTitle className="text-2xl">{title || 'Zona vietata'}</EmptyTitle>
        <EmptyDescription className="text-lg">
          {message || 'Non hai i permessi per visualizzare questa pagina.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
