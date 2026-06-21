import { PhonePreview } from "@/components/phone/PhonePreview";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* ambient premium background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <PhonePreview />
    </main>
  );
}
