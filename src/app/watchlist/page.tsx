import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WatchlistTable from "@/components/Tables/WatchlistTable"

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "These are your opening postiions",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Watchlist" />

      <div className="flex flex-col gap-10">
        <WatchlistTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
