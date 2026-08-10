import type { Metadata } from "next";
import EventHorizon from "./EventHorizon";

export const metadata: Metadata = {
  title: "Event Horizon",
  description:
    "An interactive particle countdown shaped by gravity, sound, and motion.",
};

export default function EventHorizonPage() {
  return <EventHorizon />;
}
