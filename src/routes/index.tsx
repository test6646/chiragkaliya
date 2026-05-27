import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";
import { PaperBackdrop } from "@/components/cinema/PaperBackdrop";
import { Loader } from "@/components/cinema/Loader";
import { Nav } from "@/components/cinema/Nav";
import { Hero } from "@/components/cinema/Hero";
import { DirectorsNote } from "@/components/cinema/DirectorsNote";

import { SelectedWork } from "@/components/cinema/SelectedWork";
import { Services } from "@/components/cinema/Services";
import { ColorGrading } from "@/components/cinema/ColorGrading";
import { Gear } from "@/components/cinema/Gear";
import { Process } from "@/components/cinema/Process";

import { BrandsMarquee } from "@/components/cinema/BrandsMarquee";
import { Footer } from "@/components/cinema/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chirag Kaliya — Cinematographer & Director of Photography" },
      { name: "description", content: "Cinematographer & DOP based in Botad, Gujarat. Wedding films, music videos, brand films, color grading." },
      { property: "og:title", content: "Chirag Kaliya — Cinematographer" },
      { property: "og:description", content: "A study in light, stillness & the held breath of a frame." },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main className="relative bg-paper text-ink overflow-x-clip">
      <PaperBackdrop />
      <Loader />
      <Nav />

      <Hero />
      <DirectorsNote />
      
      <SelectedWork />
      <Services />
      <ColorGrading />
      <Gear />
      <Process />
      
      <BrandsMarquee />
      <Footer />
    </main>
  );
}
