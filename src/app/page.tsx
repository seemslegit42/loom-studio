import Header from '@/components/loom/header';
import Sidebar from '@/components/loom/sidebar';
import VisualWeaver from '@/components/loom/visual-weaver';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

export default function Home() {
  return (
    <div className="bg-transparent text-foreground min-h-screen flex flex-col font-body">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 overflow-y-auto">
            <div className="xl:col-span-2 flex flex-col gap-8">
              <VisualWeaver />
            </div>
            <IncantationEditor />
          </main>
        </div>
      </div>
      <EventTimeline />
    </div>
  );
}
