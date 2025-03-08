import Head from "next/head";
import PlanningScreen from "@/components/PlanningScreen";

export default function PlanningPage() {
  return (
    <>
      <Head>
        <title>Planning | Sales & GM Analysis</title>
      </Head>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Planning Sheet</h1>
        <PlanningScreen />
      </div>
    </>
  );
}
