import { useQuery } from "@apollo/client";
import { GET_OFFERING_DETAILS } from "@/graphql/queries";
import { formatCoupleName } from "@/utils/formatCoupleName";

interface ChatHeaderProps {
  visitor: {
    visitor_fname: string;
    partner_fname?: string;
    email: string;
    phone?: string;
  };
  offeringId?: string;
}

export default function ChatHeader({ visitor, offeringId }: ChatHeaderProps) {
  const { data: offeringData } = useQuery(GET_OFFERING_DETAILS, {
    variables: { id: offeringId },
    skip: !offeringId,
  });

  const offering = offeringData?.findOfferingById;
  const coupleName = formatCoupleName(visitor, "Wedding Couple");

  return (
    <div className="bg-white dark:bg-darkSurface border-b border-gray-100 dark:border-zinc-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-orange/10 text-orange font-bold text-base sm:text-lg rounded-2xl flex-shrink-0 border border-orange/20 shadow-xs">
          {coupleName[0]?.toUpperCase() || "C"}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-title font-bold text-base sm:text-lg text-gray-900 dark:text-zinc-100 truncate leading-tight">
              {coupleName}
            </h2>
            {offering && (
              <span className="hidden sm:inline-block px-3 py-0.5 text-xs bg-orange/10 text-orange font-semibold rounded-full border border-orange/20 truncate max-w-[220px]">
                {offering.name}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5 font-body">
            {visitor.email}
            {visitor.phone ? ` • ${visitor.phone}` : ""}
            {offering && ` • ${offering.category}`}
          </p>
        </div>
      </div>

      {offering && (
        <span className="sm:hidden px-3 py-1 text-xs bg-orange/10 text-orange font-semibold rounded-full border border-orange/20 flex-shrink-0">
          {offering.name}
        </span>
      )}
    </div>
  );
}
