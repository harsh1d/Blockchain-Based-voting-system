import React from "react";
import { Card, CardBody, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useVoting } from "../context/voting-context";

export const ElectionStats: React.FC = () => {
  const { elections, votingHistory } = useVoting();
  
  const statusCounts = React.useMemo(() => {
    const counts = {
      active: elections.filter(e => e.status === "active").length,
      upcoming: elections.filter(e => e.status === "upcoming").length,
      completed: elections.filter(e => e.status === "completed").length
    };
    return counts;
  }, [elections]);
  
  const totalVotes = React.useMemo(() => {
    return elections.reduce((sum, election) => sum + election.totalVotes, 0);
  }, [elections]);
  
  const participationRate = React.useMemo(() => {
    const activeElections = elections.filter(e => e.status === "active" || e.status === "completed");
    if (activeElections.length === 0) return 0;
    
    const votedElections = votingHistory.length;
    return Math.round((votedElections / activeElections.length) * 100);
  }, [elections, votingHistory]);
  
  const pieData = [
    { name: "Active", value: statusCounts.active, color: "#17c964" },
    { name: "Upcoming", value: statusCounts.upcoming, color: "#006FEE" },
    { name: "Completed", value: statusCounts.completed, color: "#71717a" }
  ];
  
  const barData = elections
    .filter(e => e.status === "active" || e.status === "completed")
    .map(election => ({
      name: election.title.length > 20 ? election.title.substring(0, 20) + "..." : election.title,
      votes: election.totalVotes
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Election Status</h3>
            <Icon icon="lucide:pie-chart" className="text-primary text-xl" />
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip 
                  formatter={(value) => [`${value} elections`, "Count"]}
                  contentStyle={{ 
                    backgroundColor: "var(--heroui-content1)", 
                    borderColor: "var(--heroui-divider)",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center">
              <p className="text-sm text-default-500">Active</p>
              <p className="text-xl font-semibold text-success">{statusCounts.active}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-default-500">Upcoming</p>
              <p className="text-xl font-semibold text-primary">{statusCounts.upcoming}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-default-500">Completed</p>
              <p className="text-xl font-semibold">{statusCounts.completed}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Elections by Votes</h3>
            <Icon icon="lucide:bar-chart-2" className="text-primary text-xl" />
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} votes`, "Total"]}
                  contentStyle={{ 
                    backgroundColor: "var(--heroui-content1)", 
                    borderColor: "var(--heroui-divider)",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="votes" fill="#006FEE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
      
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Voting Statistics</h3>
            <Icon icon="lucide:activity" className="text-primary text-xl" />
          </div>
          
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-default-500">Total Elections</p>
                <p className="text-sm font-medium">{elections.length}</p>
              </div>
              <Progress 
                value={elections.length} 
                maxValue={10} 
                color="primary" 
                className="h-2"
                aria-label="Total elections"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-default-500">Total Votes Cast</p>
                <p className="text-sm font-medium">{totalVotes.toLocaleString()}</p>
              </div>
              <Progress 
                value={totalVotes > 10000 ? 100 : totalVotes / 100} 
                maxValue={100} 
                color="success" 
                className="h-2"
                aria-label="Total votes"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-default-500">Your Participation</p>
                <p className="text-sm font-medium">{participationRate}%</p>
              </div>
              <Progress 
                value={participationRate} 
                maxValue={100} 
                color={participationRate > 50 ? "success" : "warning"} 
                className="h-2"
                aria-label="Your participation"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-divider">
              <div>
                <p className="text-sm text-default-500">Your Votes</p>
                <p className="text-xl font-semibold">{votingHistory.length}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Blockchain Confirmations</p>
                <p className="text-xl font-semibold text-success">{votingHistory.length}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};