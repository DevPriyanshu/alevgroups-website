import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceCardContentProps = {
  Icon: LucideIcon;
  number: string;
  title: string;
  text: string;
  detail: string;
  live?: boolean;
};

export function ServiceCardContent({
  Icon,
  number,
  title,
  text,
  detail,
  live = false,
}: ServiceCardContentProps) {
  return (
    <>
      <div className="service-card-top">
        <span>{number}</span>
        <span className={`service-icon service-icon-${number}`}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <p className="service-detail">{detail}</p>
      <span className="service-card-action">
        {live ? "Open service app" : "Explore app experience"} <ArrowRight size={15} aria-hidden="true" />
      </span>
    </>
  );
}
