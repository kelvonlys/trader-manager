import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InstrumentTable from "@/components/Tables/InstrumentTable"

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <InstrumentTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
