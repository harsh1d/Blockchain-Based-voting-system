import React from "react";
import { useParams, Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Button, 
  Chip, 
  Divider, 
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useVoting } from "../context/voting-context";

interface RouteParams {
  id: string;
}

export const Results: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { getElection, hasVoted, votingHistory } = useVoting();
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("chart");
  
  const election = React.useMemo(() => getElection(id), [id, getElection]);
  
  React.useEffect(() => {
    // Simulate loading data from blockchain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading election results..." />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center py-12">
        <Icon icon="lucide:file-x" className="text-5xl text-danger mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Election Not Found</h2>
        <p className="text-default-500 mb-6">The election you're looking for doesn't exist or has been removed.</p>
        <Button as={RouteLink} to="/" color="primary">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const userVote = votingHistory.find(vote => vote.electionId === id);
  const userVotedFor = userVote ? election.candidates.find(c => c.id === userVote.candidateId) : null;
  
  const chartData = election.candidates.map(candidate => ({
    name: candidate.name,
    votes: candidate.votes,
    party: candidate.party,
    id: candidate.id,
    percentage: election.totalVotes > 0 
      ? Math.round((candidate.votes / election.totalVotes) * 100) 
      : 0
  }));
  
  // Sort by votes (highest first)
  chartData.sort((a, b) => b.votes - a.votes);
  
  // Colors for pie chart
  const COLORS = ['#006FEE', '#17c964', '#7828c8', '#f5a524', '#f31260', '#9353d3'];
  
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>
          <RouteLink to="/">Dashboard</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <RouteLink to={`/election/${id}`}>{election.title}</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Results</BreadcrumbItem>
      </Breadcrumbs>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{election.title} - Results</h1>
            <p className="text-default-500">
              {election.status === "completed" ? "Final results" : "Current standings"}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "chart" ? "flat" : "light"}
              color={activeTab === "chart" ? "primary" : "default"}
              onPress={() => setActiveTab("chart")}
              startContent={<Icon icon="lucide:bar-chart-2" />}
            >
              Chart
            </Button>
            <Button 
              variant={activeTab === "table" ? "flat" : "light"}
              color={activeTab === "table" ? "primary" : "default"}
              onPress={() => setActiveTab("table")}
              startContent={<Icon icon="lucide:list" />}
            >
              Table
            </Button>
            <Button 
              variant={activeTab === "pie" ? "flat" : "light"}
              color={activeTab === "pie" ? "primary" : "default"}
              onPress={() => setActiveTab("pie")}
              startContent={<Icon icon="lucide:pie-chart" />}
            >
              Pie
            </Button>
          </div>
        </div>
        
        {userVote && (
          <Card className="border border-primary mb-6">
            <CardBody className="py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Icon icon="lucide:check-circle" className="text-primary text-lg" />
                </div>
                <div>
                  <p className="font-medium">You voted for: <span className="text-primary">{userVotedFor?.name}</span></p>
                  <p className="text-xs text-default-500">
                    Transaction: <span className="font-mono">{userVote.transactionHash.substring(0, 10)}...</span> • 
                    {" "}{new Date(userVote.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        <Card className="border border-divider">
          <CardHeader>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Election Results</h2>
                <Chip 
                  color={election.status === "completed" ? "success" : "primary"} 
                  variant="flat"
                  size="sm"
                >
                  {election.status === "completed" ? "Final" : "Live"}
                </Chip>
              </div>
              <p className="text-default-500 text-sm">
                Total votes: {election.totalVotes.toLocaleString()}
              </p>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody>
            {activeTab === "chart" && (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={formatNumber}
                      label={{ 
                        value: 'Votes', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <RechartsTooltip
                      formatter={(value, name, props) => {
                        const data = props.payload;
                        return [
                          <>
                            <span className="font-medium">{value.toLocaleString()}</span> votes
                            <br />
                            <span className="text-default-500">
                              {data.percentage}% of total
                            </span>
                          </>,
                          "Votes"
                        ];
                      }}
                      contentStyle={{ 
                        backgroundColor: "var(--heroui-content1)", 
                        borderColor: "var(--heroui-divider)",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="votes" 
                      fill="#006FEE" 
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {activeTab === "table" && (
              <Table removeWrapper aria-label="Election results table">
                <TableHeader>
                  <TableColumn>RANK</TableColumn>
                  <TableColumn>CANDIDATE</TableColumn>
                  <TableColumn>PARTY</TableColumn>
                  <TableColumn>VOTES</TableColumn>
                  <TableColumn>PERCENTAGE</TableColumn>
                </TableHeader>
                <TableBody>
                  {chartData.map((item, index) => (
                    <TableRow key={item.id} className={userVote?.candidateId === item.id ? "bg-primary/5" : ""}>
                      <TableCell>#{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {userVote?.candidateId === item.id && (
                            <Tooltip content="You voted for this candidate">
                              <Icon icon="lucide:check" className="text-primary" />
                            </Tooltip>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          variant="flat" 
                          color={getPartyColor(item.party)} 
                          size="sm"
                        >
                          {item.party}
                        </Chip>
                      </TableCell>
                      <TableCell>{item.votes.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-default-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span>{item.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {activeTab === "pie" && (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="votes"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      isAnimationActive={true}
                      animationDuration={1000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="var(--heroui-background)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name, props) => {
                        const data = props.payload;
                        return [
                          <>
                            <span className="font-medium">{value.toLocaleString()}</span> votes
                            <br />
                            <span className="text-default-500">
                              {data.percentage}% of total
                            </span>
                          </>,
                          data.name
                        ];
                      }}
                      contentStyle={{ 
                        backgroundColor: "var(--heroui-content1)", 
                        borderColor: "var(--heroui-divider)",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
          <Divider/>
          <CardFooter className="flex justify-between">
            <Button 
              as={RouteLink}
              to={`/election/${id}`}
              variant="flat"
              startContent={<Icon icon="lucide:arrow-left" />}
            >
              Back to Election
            </Button>
            
            <Button 
              as={RouteLink}
              to="/"
              color="primary"
              variant="flat"
              endContent={<Icon icon="lucide:home" />}
            >
              Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Blockchain Verification</h2>
        
        <Card className="border border-divider">
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-default-500">Results Hash</p>
                <p className="font-mono text-sm truncate">
                  0x{generateHashFromString(`${election.id}-${election.totalVotes}-${Date.now()}`)}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-default-500">Last Updated</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Block Number</p>
                  <p className="font-medium">{(12345678 + parseInt(election.id) * 1000 + election.totalVotes).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Verification Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon icon="lucide:shield-check" className="text-success" />
                    <span className="text-success">Verified on-chain</span>
                  </div>
                </div>
              </div>
              
              <Divider/>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:lock" className="text-primary" />
                  <span className="text-sm">Results are immutably stored on the blockchain</span>
                </div>
                
                <Button 
                  variant="bordered"
                  color="primary"
                  size="sm"
                  endContent={<Icon icon="lucide:external-link" />}
                >
                  Verify on Explorer
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get color based on party
function getPartyColor(party: string): "primary" | "secondary" | "success" | "warning" | "danger" | "default" {
  const partyLower = party.toLowerCase();
  
  if (partyLower.includes("yes") || partyLower.includes("approve")) return "success";
  if (partyLower.includes("no") || partyLower.includes("reject")) return "danger";
  if (partyLower.includes("proposal a")) return "primary";
  if (partyLower.includes("proposal b")) return "secondary";
  if (partyLower.includes("proposal c")) return "warning";
  
  // For political parties, assign colors based on first letter to keep it consistent
  const firstChar = partyLower.charAt(0);
  if (firstChar <= 'e') return "primary";
  if (firstChar <= 'j') return "success";
  if (firstChar <= 'o') return "secondary";
  if (firstChar <= 't') return "warning";
  
  return "default";
}

// Helper function to generate a deterministic hash from a string
function generateHashFromString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure it's 40 chars (20 bytes) for ETH address
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return hexHash.padEnd(40, '0');
}