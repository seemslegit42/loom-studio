import Header from "@/components/loom/header";
import WorkflowDesigner from "@/components/loom/workflow-designer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <WorkflowDesigner />
      </main>
    </div>
  );
}
