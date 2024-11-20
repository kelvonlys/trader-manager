import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InstrumentTable from "@/components/Tables/InstrumentTable"

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Opening Positions",
  description: "These are your opening postiions",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Opening Positions" />

      <div className="flex flex-col gap-10">
        <InstrumentTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
