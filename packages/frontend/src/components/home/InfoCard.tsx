// src/components/home/InfoCard.tsx

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props for the InfoCard component.
 */
interface InfoCardProps {
  /** A React component (typically an icon) to display at the top of the card. */
  icon: ReactNode;
  /** The title of the information card. */
  title: string;
  /** The descriptive content of the card. */
  children: ReactNode;
}

/**
 * A reusable card component for displaying key features or information points
 * on the homepage, characterized by a prominent icon and centered text.
 */
const InfoCard = ({ icon, title, children }: InfoCardProps) => {
  return (
    <Card className="flex h-full flex-col border-none bg-white text-center shadow-lg">
      <CardHeader>
        {/* A decorative circular background for the icon. */}
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-left text-neutral-600">{children}</CardContent>
    </Card>
  );
};

export default InfoCard;

