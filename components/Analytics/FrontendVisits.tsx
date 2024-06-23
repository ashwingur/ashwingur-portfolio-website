import Card from "@components/Card";
import { FrontendAnalytics } from "@interfaces/analytics.interface";
import React from "react";
import { useQuery } from "react-query";
import AnalyticsChart from "./AnalyticsChart";
import clsx from "clsx";

interface FrontendVisitsProps {
  startTime: Date;
  endTime: Date;
  className?: string;
}

const fetchFrontEndAnalytics = async (
  start_time: string,
  end_time: string,
  route?: string
): Promise<FrontendAnalytics> => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_ASHWINGUR_API}/analytics/frontend_visits`
    );
    url.searchParams.append("start_time", start_time);
    url.searchParams.append("end_time", end_time);
    if (route) {
      url.searchParams.append("route", route);
    }

    const response = await fetch(url.toString(), { credentials: "include" });

    if (!response.ok) {
      throw new Error("Failed to fetch frontend analytics data");
    }

    const analyticsData: FrontendAnalytics = await response.json();
    return analyticsData;
  } catch (error) {
    throw new Error(`Failed to fetch frontend analytics data: ${error}`);
  }
};

const roundToNearestMinute = (date: Date): Date => {
  const ms = 60000; // milliseconds in a minute
  return new Date(Math.ceil(date.getTime() / ms) * ms);
};

const FrontendVisits: React.FC<FrontendVisitsProps> = ({
  startTime,
  endTime,
  className,
}) => {
  let start_time = new Date();
  start_time.setHours(start_time.getHours() - 24);
  start_time = roundToNearestMinute(start_time);
  let end_time = roundToNearestMinute(new Date());
  const route: string | undefined = undefined;

  const { data, isLoading, isError } = useQuery<FrontendAnalytics>({
    queryKey: ["frontendAnalytics", startTime, endTime, route],
    queryFn: () =>
      fetchFrontEndAnalytics(
        startTime.toISOString(),
        endTime.toISOString(),
        route
      ),
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    keepPreviousData: true, // Keeps the previous data while fetching new data (also smooth transitions as a benefit)
  });

  if (isLoading) {
    return (
      <Card firstLayer={true} className="flex flex-col items-center">
        <h2>Frontend Visits</h2>
        <p className="text-center">LOADING</p>
      </Card>
    );
  }

  if (isError || data === undefined) {
    return (
      <Card firstLayer={true} className="flex flex-col items-center">
        <h2>Frontend Visits</h2>
        <p className="text-center">Error fetching frontend statistics</p>
      </Card>
    );
  }

  const timestamps = data.timeseries_data.map((d) => d.timestamp);
  const total_visits = data.timeseries_data.map((d) => d.total_visits);
  const unique_ids = data.timeseries_data.map((d) => d.unique_user_ids);
  const unique_ips = data.timeseries_data.map((d) => d.unique_users_ips);
  const routes = data.timeseries_data.map((d) => d.unique_routes);

  return (
    <Card
      firstLayer={true}
      className={clsx(className, "flex flex-col items-center")}
    >
      <h2>Frontend Visits</h2>
      <div className="flex flex-col self-stretch gap-8 lg:px-4">
        <AnalyticsChart
          timestamps={timestamps}
          values={total_visits}
          routes={routes}
          title={"Total Visits"}
        />
        <AnalyticsChart
          timestamps={timestamps}
          values={unique_ids}
          routes={routes}
          title={"Unique User IDs"}
        />
        <AnalyticsChart
          timestamps={timestamps}
          values={unique_ips}
          routes={routes}
          title={"Unique User IPs"}
        />
      </div>
    </Card>
  );
};

export default FrontendVisits;
