import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Button, 
  Chip, 
  Divider, 
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVoting } from "../context/voting-context";

export const Profile: React.FC = () => {
  const { user, votingHistory, elections } = useVoting();
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("votes");
  
  React.useEffect(() => {
    // Simulate loading data from blockchain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const votingDetails = React.useMemo(() => {
    return votingHistory.map(vote => {
      const election = elections.find(e => e.id === vote.electionId);
      const candidate = election?.candidates.find(c => c.id === vote.candidateId);
      
      return {
        ...vote,
        electionTitle: election?.title || "Unknown Election",
        candidateName: candidate?.name || "Unknown Candidate",
        candidateParty: candidate?.party || "Unknown Party",
        electionStatus: election?.status || "unknown"
      };
    });
  }, [votingHistory, elections]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading profile data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-default-500">
          Manage your blockchain voting account and view your voting history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border border-divider">
            <CardHeader className="flex gap-3">
              <Avatar
                isBordered
                color="primary"
                src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
                className="w-20 h-20"
              />
              <div className="flex flex-col">
                <p className="text-lg font-bold">{user.name}</p>
                <p className="text-default-500 text-sm">{user.email}</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-500">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm truncate">{user.walletAddress}</p>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="lucide:copy" size={16} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Votes Cast</p>
                  <p className="font-medium">{votingHistory.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Account Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon icon="lucide:shield-check" className="text-success" />
                    <span className="text-success">Verified</span>
                  </div>
                </div>
                
                <Divider/>
                
                <div className="space-y-3">
                  <Button 
                    fullWidth
                    variant="bordered"
                    startContent={<Icon icon="lucide:settings" />}
                  >
                    Account Settings
                  </Button>
                  
                  <Button 
                    fullWidth
                    variant="bordered"
                    startContent={<Icon icon="lucide:key" />}
                  >
                    Manage Keys
                  </Button>
                  
                  <Button 
                    fullWidth
                    variant="bordered"
                    color="danger"
                    startContent={<Icon icon="lucide:log-out" />}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader>
              <Tabs 
                aria-label="Profile tabs" 
                color="primary" 
                variant="underlined"
                selectedKey={activeTab}
                onSelectionChange={setActiveTab as any}
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary"
                }}
              >
                <Tab 
                  key="votes" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:check-square" />
                      <span>My Votes</span>
                    </div>
                  } 
                />
                <Tab 
                  key="activity" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:activity" />
                      <span>Activity</span>
                    </div>
                  } 
                />
                <Tab 
                  key="notifications" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:bell" />
                      <span>Notifications</span>
                      <Chip size="sm" color="danger">3</Chip>
                    </div>
                  } 
                />
              </Tabs>
            </CardHeader>
            <Divider/>
            <CardBody>
              {activeTab === "votes" && (
                <>
                  {votingDetails.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon icon="lucide:vote" className="text-4xl text-default-400 mx-auto mb-4" />
                      <p className="text-default-500 mb-4">You haven't voted in any elections yet.</p>
                      <Button 
                        as={RouteLink}
                        to="/"
                        color="primary"
                        variant="flat"
                      >
                        Browse Active Elections
                      </Button>
                    </div>
                  ) : (
                    <Table removeWrapper aria-label="My voting history">
                      <TableHeader>
                        <TableColumn>ELECTION</TableColumn>
                        <TableColumn>CANDIDATE</TableColumn>
                        <TableColumn>DATE</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {votingDetails.map((vote) => (
                          <TableRow key={vote.electionId}>
                            <TableCell>
                              <RouteLink to={`/election/${vote.electionId}`} className="text-primary hover:underline">
                                {vote.electionTitle}
                              </RouteLink>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{vote.candidateName}</span>
                                <Chip 
                                  variant="flat" 
                                  color={getPartyColor(vote.candidateParty)} 
                                  size="sm"
                                >
                                  {vote.candidateParty}
                                </Chip>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(vote.timestamp).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Chip 
                                color="success" 
                                variant="dot"
                                size="sm"
                              >
                                Confirmed
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  as={RouteLink}
                                  to={`/results/${vote.electionId}`}
                                  size="sm"
                                  variant="bordered"
                                >
                                  Results
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="light"
                                  isIconOnly
                                >
                                  <Icon icon="lucide:external-link" size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
              
              {activeTab === "activity" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border border-divider rounded-medium">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon icon="lucide:vote" className="text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">You voted in <span className="text-primary">Park Renovation Project</span></p>
                      <p className="text-xs text-default-500">April 15, 2024 • Transaction: 0x3a1b2c3d4e...</p>
                    </div>
                    <Button 
                      as={RouteLink}
                      to="/results/4"
                      size="sm"
                      variant="light"
                    >
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-divider rounded-medium">
                    <div className="p-2 bg-success/10 rounded-full">
                      <Icon icon="lucide:user-check" className="text-success" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Account verified successfully</p>
                      <p className="text-xs text-default-500">April 10, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-divider rounded-medium">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon icon="lucide:user-plus" className="text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Account created</p>
                      <p className="text-xs text-default-500">April 5, 2024</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-danger/5 border border-danger/20 rounded-medium">
                    <div className="p-2 bg-danger/10 rounded-full">
                      <Icon icon="lucide:bell-ring" className="text-danger" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">New election available: City Mayor Election 2024</p>
                      <p className="text-xs text-default-500">1 hour ago</p>
                    </div>
                    <Button 
                      as={RouteLink}
                      to="/election/1"
                      size="sm"
                      color="danger"
                      variant="flat"
                    >
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-danger/5 border border-danger/20 rounded-medium">
                    <div className="p-2 bg-danger/10 rounded-full">
                      <Icon icon="lucide:bell-ring" className="text-danger" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">New election available: School Board Election</p>
                      <p className="text-xs text-default-500">1 day ago</p>
                    </div>
                    <Button 
                      as={RouteLink}
                      to="/election/2"
                      size="sm"
                      color="danger"
                      variant="flat"
                    >
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-danger/5 border border-danger/20 rounded-medium">
                    <div className="p-2 bg-danger/10 rounded-full">
                      <Icon icon="lucide:bell-ring" className="text-danger" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Security alert: New device login</p>
                      <p className="text-xs text-default-500">2 days ago</p>
                    </div>
                    <Button 
                      size="sm"
                      color="danger"
                      variant="flat"
                    >
                      Review
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-divider rounded-medium">
                    <div className="p-2 bg-default-100 rounded-full">
                      <Icon icon="lucide:bell" className="text-default-500" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Park Renovation Project voting has ended</p>
                      <p className="text-xs text-default-500">1 week ago</p>
                    </div>
                    <Button 
                      as={RouteLink}
                      to="/results/4"
                      size="sm"
                      variant="light"
                    >
                      Results
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
            <Divider/>
            <CardFooter>
              <div className="w-full flex justify-between">
                <Button 
                  as={RouteLink}
                  to="/"
                  variant="light"
                  startContent={<Icon icon="lucide:arrow-left" />}
                >
                  Back to Dashboard
                </Button>
                
                {activeTab === "notifications" && (
                  <Button 
                    color="primary"
                    variant="flat"
                  >
                    Mark All as Read
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
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