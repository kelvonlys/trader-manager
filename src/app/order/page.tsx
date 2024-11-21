import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InstrumentTable from "@/components/Tables/InstrumentTable"

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import OrderTable from "@/components/Tables/OrderTable";

export const metadata: Metadata = {
  title: "Pending Order",
  description: "These are your pending orders",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Opening Orders" />

      <div className="flex flex-col gap-10">
        <OrderTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
