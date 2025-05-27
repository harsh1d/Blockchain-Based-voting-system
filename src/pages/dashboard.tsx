import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardFooter, 
  Button, 
  Chip, 
  Tabs, 
  Tab, 
  Spinner,
  Link,
  Image
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVoting } from "../context/voting-context";
import { ElectionStats } from "../components/election-stats";

export const Dashboard: React.FC = () => {
  const { elections, hasVoted } = useVoting();
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    // Simulate loading data from blockchain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredElections = React.useMemo(() => {
    if (filter === "all") return elections;
    return elections.filter(election => election.status === filter);
  }, [elections, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "upcoming": return "primary";
      case "completed": return "default";
      default: return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading elections..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Blockchain Voting Dashboard</h1>
        <p className="text-default-500">
          Secure, transparent, and tamper-proof voting system powered by blockchain technology.
        </p>
      </div>

      <ElectionStats />

      <div>
        <Tabs 
          aria-label="Election filters" 
          color="primary" 
          variant="underlined"
          selectedKey={filter}
          onSelectionChange={setFilter as any}
          classNames={{
            tabList: "gap-6",
            cursor: "w-full bg-primary"
          }}
        >
          <Tab key="all" title="All Elections" />
          <Tab key="active" title="Active" />
          <Tab key="upcoming" title="Upcoming" />
          <Tab key="completed" title="Completed" />
        </Tabs>
      </div>

      {filteredElections.length === 0 ? (
        <div className="text-center py-12">
          <Icon icon="lucide:search-x" className="text-4xl text-default-400 mx-auto mb-4" />
          <p className="text-default-500">No elections found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => (
            <Card key={election.id} className="border border-divider">
              <CardBody className="p-0 overflow-visible">
                <Image
                  removeWrapper
                  alt={election.title}
                  className="w-full object-cover h-48"
                  src={`https://img.heroui.chat/image/places?w=600&h=400&u=${election.imageId}`}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Chip color={getStatusColor(election.status)} variant="flat" size="sm">
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </Chip>
                    {hasVoted(election.id) && (
                      <Chip color="secondary" variant="flat" size="sm">
                        <Icon icon="lucide:check" className="mr-1" />
                        Voted
                      </Chip>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{election.title}</h3>
                  <p className="text-default-500 text-sm mb-4 line-clamp-2">
                    {election.description}
                  </p>
                  <div className="flex flex-col gap-1 text-sm text-default-500">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:calendar" size={16} />
                      <span>
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:users" size={16} />
                      <span>{election.candidates.length} Candidates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:check-square" size={16} />
                      <span>{election.totalVotes.toLocaleString()} Votes Cast</span>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex gap-2 justify-between">
                <Button 
                  as={RouteLink}
                  to={`/election/${election.id}`}
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:info" />}
                >
                  Details
                </Button>
                {election.status === "active" && !hasVoted(election.id) ? (
                  <Button 
                    as={RouteLink}
                    to={`/vote/${election.id}`}
                    color="primary"
                    endContent={<Icon icon="lucide:vote" />}
                  >
                    Vote Now
                  </Button>
                ) : election.status === "completed" || hasVoted(election.id) ? (
                  <Button 
                    as={RouteLink}
                    to={`/results/${election.id}`}
                    variant="bordered"
                    color="default"
                    endContent={<Icon icon="lucide:bar-chart-2" />}
                  >
                    Results
                  </Button>
                ) : (
                  <Button 
                    isDisabled
                    variant="bordered"
                    endContent={<Icon icon="lucide:clock" />}
                  >
                    Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};