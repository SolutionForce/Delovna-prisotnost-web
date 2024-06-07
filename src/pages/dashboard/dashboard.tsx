import ChartOne from "./charts/ChartOne";
import ChartThree from "./charts/ChartThree";
import ChartTwo from "./charts/ChartTwo";

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">

            <ChartOne />
            <br />
            <ChartTwo />
            <br />
            <ChartThree />
            </div>
        </div>
    );
}
